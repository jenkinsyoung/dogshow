const express = require('express');
const app = express();
const cors = require('cors');
const port = 8082; // Порт, на котором будет работать сервер
app.use(cors());
app.use(express.json({ limit: '50mb' }));
//Генерация jwt токена
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    userId: user.id,
    login: user.login,
    password: user.password,
    name: user.name,
    surname: user.surname,
    patronymic: user.patronymic,
    email: user.email,
    passport: user.passport,
    image: user.image,
    role_id: user.role_id
  };

  const token = jwt.sign(payload, '123', { expiresIn: '24h' }); 

  return token;
};


// Определение маршрутов

app.get('/auth', async (req, res) => {
  const login = req.query.login;
  try {
    const searchLogin  = login;
    const query = {
      text: 'SELECT * FROM "user" WHERE login ILIKE $1',
      values: [`%${searchLogin}%`],
    };
    // Выполняем запрос к базе данных
    const result = await pool.query(query);
    const user = result.rows[0];
    const token = generateToken(user);

    // Отправляем токен клиенту вместо данных пользователя
    res.json({ token });
  } catch (error) {
    console.error('Error searching in database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/register', async (req, res) =>{
  try {
    const { name, surname, patronymic, login, password, role_id } = req.body;

    // Проверяем, существует ли пользователь с таким именем
    const userExists = await pool.query('SELECT * FROM "user" WHERE login = $1', [login]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const id = (await pool.query('SELECT * FROM "user"')).rowCount + 1
  
    // Добавляем нового пользователя в базу данных
    const newUser = await pool.query('INSERT INTO "user" (id, name, surname, patronymic, login, password, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [id, name, surname, patronymic, login, password, parseInt(role_id)]);
    const token = generateToken(newUser.rows[0]);
    res.status(201).json({token});
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


// Маршруты для пользователя
app.get('/dogs', async(req, res) =>{
  const ownerId = req.query.userId;
  try{
    const searchId = parseInt(ownerId);

    // Подготавливаем SQL-запрос с параметрами
    const query = {
      text: `SELECT dog.id, dog.name, dog.age, breed.name AS breed, club.name AS club, 
      vaccination, ARRAY_AGG(DISTINCT ring.name) AS rings, criterion.name AS criteria, 
      mark.value, COALESCE(reward_counts.gold_count, 0) AS gold_count,
      COALESCE(reward_counts.silver_count, 0) AS silver_count,
      COALESCE(reward_counts.bronze_count, 0) AS bronze_count,
      ARRAY_AGG(DISTINCT photo.image) AS images
  FROM "dog"
  LEFT JOIN "photo" ON dog.id = photo.dog_id  
  LEFT JOIN "breed" ON breed.id = dog.breed_id
  LEFT JOIN "application" ON application.dog_id = dog.id
  LEFT JOIN "ring" ON application.ring_id = ring.id
  LEFT JOIN "dog_reward" ON dog.id = dog_reward.dog_id
  LEFT JOIN "mark" ON mark.dog_id = dog.id
  LEFT JOIN "criterion" ON mark.criterion_id = criterion.id
  LEFT JOIN "club" ON club.id = dog.club_id
  LEFT JOIN (
      SELECT 
          dog_id,
          SUM(CASE WHEN reward_id = 1 THEN 1 ELSE 0 END) AS gold_count,
          SUM(CASE WHEN reward_id = 2 THEN 1 ELSE 0 END) AS silver_count,
          SUM(CASE WHEN reward_id = 3 THEN 1 ELSE 0 END) AS bronze_count
      FROM "dog_reward"
      GROUP BY dog_id
  ) AS reward_counts ON dog.id = reward_counts.dog_id
  WHERE user_id = $1 
  GROUP BY dog.id, dog.name, dog.age, breed.name, club.name, vaccination, criterion_id, mark.value, criteria, gold_count, silver_count, bronze_count;`,
      values: [searchId],
    };
    const result = await pool.query(query);
    const rows = result.rows;

    // Обработка данных для группировки marks
    const dogs = {};

    rows.forEach(row => {
      if (!dogs[row.id]) {
        dogs[row.id] = {
          id: row.id,
          name: row.name,
          age: row.age,
          breed: row.breed,
          club: row.club,
          vaccination: row.vaccination,
          rings: row.rings,
          gold_count: row.gold_count,
          silver_count: row.silver_count,
          bronze_count: row.bronze_count,
          images: row.images,
          marks: []
        };
      }

      if (row.criteria && row.value) {
        dogs[row.id].marks.push({
          criteria: row.criteria,
          value: row.value
        });
      }
    });

    // Преобразование объекта в массив
    const data = Object.values(dogs);

    res.json(data);
  }catch(error) {
    console.error('Error searching in database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/new_dog', async (req, res) => {
  try {
    const { name, owner_id, age, vaccination, breed_id, images } = req.body;

    // Проверяем, существует ли собака с таким именем и породой у данного пользователя
    const dogExists = await pool.query('SELECT * FROM "dog" WHERE name = $1 AND user_id = $2 AND breed_id = $3', [name, owner_id, breed_id]);
    if (dogExists.rows.length > 0) {
      return res.status(400).json({ error: 'Dog with this name and breed already exists for this owner' });
    }

    // Добавляем новую собаку в базу данных
    const dogId = (await pool.query('SELECT MAX(id) AS max_id FROM "dog"')).rows[0].max_id + 1;
    const insertDogQuery = 'INSERT INTO "dog" (id, name, age, vaccination, user_id, breed_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
    const insertDogValues = [dogId, name, parseInt(age), vaccination, parseInt(owner_id), parseInt(breed_id)];
    await pool.query(insertDogQuery, insertDogValues);
    
  
    // Сохраняем изображения и добавляем ссылки на них в базу данных
    for (const base64Image of images) {
      const insertPhotoQuery = 'INSERT INTO "photo" (dog_id, image) VALUES ($1, $2)';
      const insertPhotoValues = [dogId, base64Image];
      await pool.query(insertPhotoQuery, insertPhotoValues);
    }

    res.status(201).json({ message: 'Dog successfully registered' });
  } catch (error) {
    console.error('Error registering dog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/delete_dog', async(req, res) => {
  const dogId = req.query.id
  try {
    await pool.query('BEGIN');

    const deleteDogRewardQuery = {
      text: `DELETE FROM "dog_reward" WHERE dog_id = $1`,
      values: [parseInt(dogId)]
    };
    await pool.query(deleteDogRewardQuery);

    const deleteApplicationQuery = {
      text: `DELETE FROM "application" WHERE dog_id = $1`,
      values: [parseInt(dogId)]
    };
    await pool.query(deleteApplicationQuery);

    const deletePhotoQuery = {
      text: `DELETE FROM "photo" WHERE dog_id = $1`,
      values: [parseInt(dogId)]
    };
    await pool.query(deletePhotoQuery);

    const deleteMarkQuery = {
      text: `DELETE FROM "mark" WHERE dog_id = $1`,
      values: [parseInt(dogId)]
    };
    await pool.query(deleteMarkQuery);

    const deleteDogQuery = {
      text: `DELETE FROM "dog" WHERE id = $1`,
      values: [parseInt(dogId)]
    };
    await pool.query(deleteDogQuery);

    await pool.query('COMMIT');
    res.status(200).json({ message: 'Dog deleted successfully' });

  } catch (error) {
    await pool.query('ROLLBACK')
    console.error('Error deleting dog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.put('/edit_dog', async (req, res) => {
  try{

    res.status(204).json({message: 'Dog successfully updated'})
  }catch(error){
    
  }
})


// Маршруты для администратора

app.get('/admin/rings', async(req, res)=>{
  try{
    const query={
      text: `SELECT ring.id, ring.name, ring.address, ARRAY_AGG(breed.name) as specialization, 
      ARRAY_AGG(CONCAT(u.surname, ' ', SUBSTRING(u.name, 1, 1), ' ', SUBSTRING(u.patronymic, 1, 1))) as experts FROM "ring"
      FULL JOIN "ring_breed" ON ring.id = ring_breed.ring_id
      LEFT JOIN "breed" ON breed.id = ring_breed.breed_id
      FULL JOIN "expert_ring" ON ring.id = expert_ring.ring_id AND expert_ring.status = 'Одобрено'
      LEFT JOIN "expert" ON expert.id = expert_ring.expert_id
      LEFT JOIN "user" u ON u.id = expert.user_id
      GROUP BY ring.id, ring.name, ring.address`
    }
    const result = await pool.query(query);
    res.json(result.rows);
  }catch(error){
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/admin/create_ring', async(req, res)=>{
  const { name, address, breed_id } = req.body;
  const existingRing = await pool.query(
    'SELECT * FROM "ring" WHERE name = $1 AND address = $2',
    [name, address]
  );

  if (existingRing.rows.length > 0) {
    return res.status(400).json({ error: 'Ring with the same name and address already exists' });
  }

  const result = await pool.query(
    'INSERT INTO "ring" (name, address) VALUES ($1, $2) RETURNING id',
    [name, address]
  );

  const ringId = result.rows[0].id;
  const insertPromises = breed_id.map(breedId => {
    return pool.query(
      'INSERT INTO "ring_breed" (ring_id, breed_id) VALUES ($1, $2)',
      [ringId, breedId]
    );
  });
  try{

    await Promise.all(insertPromises);

    res.status(201).json({ message: 'Ring created successfully', ringId });
  } catch(error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/admin/delete_ring', async(req, res)=>{
  const ringId = req.query.id
  try {
    await pool.query('BEGIN');

    const deleteBreedRingQuery = {
      text: `DELETE FROM "ring_breed" WHERE ring_id = $1`,
      values: [ringId]
    };
    await pool.query(deleteBreedRingQuery);

    const deleteRingQuery = {
      text: `DELETE FROM "ring" WHERE id = $1`,
      values: [ringId]
    };
    await pool.query(deleteRingQuery);

    await pool.query('COMMIT');
    res.status(200).json({ message: 'Item deleted successfully' });

  } catch (error) {
    await pool.query('ROLLBACK')
    console.error('Error deleting ring:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/admin/participants', async(req, res) =>{
  try{
    const query={
      text: `SELECT application.id, dog.name AS nickname, breed.name AS breed, dog.age,
      CONCAT(u.surname, ' ', SUBSTRING(u.name, 1, 1), '. ', SUBSTRING(u.patronymic, 1, 1), '.') AS fio,
      club.name AS club, ring.name AS ring, COUNT(dog_reward.reward_id) AS reward_cnt, application.status FROM "application"
      LEFT JOIN "dog" ON dog.id = application.dog_id
      LEFT JOIN "breed" ON breed.id = dog.breed_id
      LEFT JOIN "user" u ON u.id = dog.user_id
      LEFT JOIN "ring" ON ring.id = application.ring_id
      LEFT JOIN "club" ON club.id = dog.club_id
      FULL JOIN "dog_reward" ON dog.id = dog_reward.dog_id
      GROUP BY application.id, nickname, breed, dog.age, fio, club, ring, application.status`
    }
    const result = await pool.query(query);
    res.json(result.rows);
  }catch(error){
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.put('/admin/reject_status', async(req, res) =>{
  const applicationId = req.query.id
  try {
    await pool.query('BEGIN');

    const rejectStatusQuery = {
      text: `UPDATE "application" SET "status" = 'Отклонено' WHERE id = $1`,
      values: [applicationId]
    };
    await pool.query(rejectStatusQuery);

    await pool.query('COMMIT');
    res.status(200).json({ message: 'Status updated successfully' });

  } catch (error) {
    await pool.query('ROLLBACK')
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/admin/approve_status', async(req, res) =>{
  const applicationId = req.query.id
  try {
    await pool.query('BEGIN');

    const approveStatusQuery = {
      text: `UPDATE "application" SET "status" = 'Одобрено' WHERE id = $1`,
      values: [applicationId]
    };
    await pool.query(approveStatusQuery);

    await pool.query('COMMIT');
    res.status(200).json({ message: 'Status updated successfully' });

  } catch (error) {
    await pool.query('ROLLBACK')
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/admin/new_participant', async(req, res)=>{
  const {dog_id, ring_id} = req.body;
  try{
    const query={
      text: `INSERT INTO "application" (dog_id, ring_id) VALUES ($1, $2)`,
      values: [dog_id, ring_id]
    }
    await pool.query(query);
    res.status(201).json({ message: 'Participant created successfully' });
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})



// Общие маршруты
app.get('/breeds', async(req, res) => {
  try{
    const query ={
      text: 'SELECT id AS value, name AS label FROM "breed"',
    }
    const result = await pool.query(query);
    res.json(result.rows);
  }catch(error) {
    console.error('Error searching in database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

const { Pool } = require('pg');

// Подключение к базе данных PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dogshow',
  password: 'qwerty',
  port: 5432,
});


