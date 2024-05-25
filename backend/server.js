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
    if (role_id === '3') {
      await pool.query('INSERT INTO "expert" (user_id) VALUES ($1)', [newUser.rows[0].id]);
    }
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

    const query = {
      text: `SELECT dog.id, dog.name, dog.age, breed.name AS breed, 
      vaccination, ring.name AS ring, application.status AS application_status, 
      criterion.name AS criteria, mark.value, 
      COALESCE(reward_counts.gold_count, 0) AS gold_count,
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
    LEFT JOIN (
        SELECT 
            dog_id,
            SUM(CASE WHEN reward_id = 1 THEN count ELSE 0 END) AS gold_count,
            SUM(CASE WHEN reward_id = 2 THEN count ELSE 0 END) AS silver_count,
            SUM(CASE WHEN reward_id = 3 THEN count ELSE 0 END) AS bronze_count
        FROM "dog_reward"
        GROUP BY dog_id
    ) AS reward_counts ON dog.id = reward_counts.dog_id
    WHERE dog.user_id = $1 
    GROUP BY dog.id, dog.name, dog.age, breed.name, vaccination, ring.name, application.status, criterion.name, mark.value, gold_count, silver_count, bronze_count;`,
      values: [searchId],
    };
    const result = await pool.query(query);
    const rows = result.rows;
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
          rings: [],
          gold_count: row.gold_count,
          silver_count: row.silver_count,
          bronze_count: row.bronze_count,
          images: row.images,
          marks: []
        };
      }

      if (row.criteria && row.value && row.application_status === 'Одобрено') {
        dogs[row.id].marks.push({
          criteria: row.criteria,
          value: row.value
        });
      }

      if (row.ring && row.application_status && !dogs[row.id].rings.some(r => r.ring === row.ring)) {
        dogs[row.id].rings.push({
          ring: row.ring,
          status: row.application_status
        });
      }
    });
  
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
  const {id, images, name, age, vaccination, breed_id, gold_count, silver_count, bronze_count} = req.body
  try {
    await pool.query('BEGIN');
    const dogFields = [];
    const dogValues = [];
    let fieldIndex = 1;

    if (name) {
      dogFields.push(`name = $${fieldIndex++}`);
      dogValues.push(name);
    }

    if (age) {
      dogFields.push(`age = $${fieldIndex++}`);
      dogValues.push(age);
    }

    if (vaccination) {
      dogFields.push(`vaccination = $${fieldIndex++}`);
      dogValues.push(vaccination);
    }

    if (breed_id) {
      dogFields.push(`breed_id = $${fieldIndex++}`);
      dogValues.push(breed_id);
    }

    if (dogFields.length > 0) {
      const updateDogQuery = `UPDATE "dog" SET ${dogFields.join(', ')} WHERE id = $${fieldIndex}`;
      dogValues.push(id);
      await pool.query(updateDogQuery, dogValues);
    }

    if (images && images.length > 0) {
      await pool.query('DELETE FROM "photo" WHERE dog_id = $1', [id]);

      const insertPhotoQuery = 'INSERT INTO "photo" (dog_id, image) VALUES ($1, $2)';
      for (const image of images) {
        await pool.query(insertPhotoQuery, [id, image]);
      }
    }

    const updateRewardQuery = `
      INSERT INTO "dog_reward" (dog_id, reward_id, count)
      VALUES ($1, $2, $3)
      ON CONFLICT (dog_id, reward_id)
      DO UPDATE SET count = EXCLUDED.count
    `;

    if (gold_count !== undefined) {
      await pool.query(updateRewardQuery, [id, 1, gold_count]);
    }

    if (silver_count !== undefined) {
      await pool.query(updateRewardQuery, [id, 2, silver_count]);
    }

    if (bronze_count !== undefined) {
      await pool.query(updateRewardQuery, [id, 3, bronze_count]);
    }

    await pool.query('COMMIT');

    res.status(204).json({ message: 'Dog data updated successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating dog data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/new_application', async(req, res) =>{
  const {dog_id, ring_id} = req.body
  try{
    const existingApplication = await pool.query('SELECT * FROM "application" WHERE dog_id = $1 AND ring_id = $2', [parseInt(dog_id), parseInt(ring_id)]);
    if (existingApplication.rows.length > 0) {
      return res.status(400).json({ error: 'Application already exists' });
    }
    const query={
      text: `INSERT INTO "application" (dog_id, ring_id) VALUES ($1, $2);`,
      values: [parseInt(dog_id), parseInt(ring_id)]
    }
    await pool.query(query);
    res.status(201).json({message: 'Application created successfully'});
  }catch(error){
    console.error('Error registering application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.delete('/delete_application')

app.get('/experts', async(req, res) =>{
  try{
    const query={
      text: `SELECT CONCAT(u.surname, ' ', u.name, ' ', u.patronymic) AS fio,
      u.image AS image, breed.name AS breed, u.email AS email
      FROM "expert"
      LEFT JOIN "user" u ON expert.user_id = u.id
      LEFT JOIN "breed" ON breed.id = expert.breed_id;`
    }
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  }catch(error){
    console.error('Error searching in database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Маршруты для администратора

app.get('/admin/rings', async(req, res)=>{
  try{
    const query={
      text: `SELECT ring.id, ring.name, ring.address, ARRAY_AGG(breed.name) as specialization, 
      ARRAY_AGG(DISTINCT CONCAT(u.surname, ' ', SUBSTRING(u.name, 1, 1), ' ', SUBSTRING(u.patronymic, 1, 1))) as experts FROM "ring"
      LEFT JOIN "ring_breed" ON ring.id = ring_breed.ring_id
      LEFT JOIN "breed" ON breed.id = ring_breed.breed_id
      LEFT JOIN "expert_ring" ON ring.id = expert_ring.ring_id AND expert_ring.status = 'Одобрено'
      LEFT JOIN "expert" ON expert.id = expert_ring.expert_id
      LEFT JOIN "user" u ON u.id = expert.user_id
      GROUP BY ring.id, ring.name, ring.address;`
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

    const deleteExpertRingQuery = {
      text: `DELETE FROM "expert_ring" WHERE ring_id = $1`,
      values: [ringId]
    };
    await pool.query(deleteExpertRingQuery);

    const deleteApplicationQuery = {
      text: `DELETE FROM "application" WHERE ring_id = $1`,
      values: [ringId]
    };
    await pool.query(deleteApplicationQuery);

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

app.put('/admin/edit_ring')

app.get('/admin/participants', async(req, res) =>{
  try{
    const query={
      text: `SELECT application.id, dog.name AS nickname, breed.name AS breed,
      dog.age, CONCAT(u.surname, ' ', SUBSTRING(u.name, 1, 1), '. ', SUBSTRING(u.patronymic, 1, 1), '.') AS fio,
      ring.name AS ring, specialization,
      COUNT(dog_reward.reward_id) AS reward_cnt, application.status FROM "application"
  LEFT JOIN "dog" ON dog.id = application.dog_id
  LEFT JOIN "breed" ON breed.id = dog.breed_id
  LEFT JOIN "user" u ON u.id = dog.user_id
  LEFT JOIN "ring" ON ring.id = application.ring_id
  LEFT JOIN "dog_reward" ON dog.id = dog_reward.dog_id
  LEFT JOIN (
      SELECT
          ring.id AS ring_id,
          ARRAY_AGG(DISTINCT breed.name) AS specialization
      FROM "ring"
      LEFT JOIN "ring_breed" ON ring.id = ring_breed.ring_id
      LEFT JOIN "breed" ON breed.id = ring_breed.breed_id
      GROUP BY ring.id
  ) AS ring_specializations ON ring.id = ring_specializations.ring_id
  GROUP BY application.id, nickname, breed, dog.age, fio, ring.name, specialization, application.status`
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
    res.status(204).json({ message: 'Status updated successfully' });

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
    res.status(204).json({ message: 'Status updated successfully' });

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

app.get('/admin/dogs', async(req, res) =>{
  try{
    const query={
      text: `SELECT dog.id AS value, CONCAT(dog.name, ' (', CONCAT(u.surname, ' ', u.name, ' ', u.patronymic), ', ', breed.name, ')') AS label FROM "dog"
      LEFT JOIN "breed" ON breed.id = dog.breed_id
      LEFT JOIN "user" u On u.id = dog.user_id;`
    }
    const result = await pool.query(query);
    res.json(result.rows);
  }catch(error) {
    console.error('Error searching in database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})
app.get('/admin/user_rings', async(req, res) =>{
  try{
    const query={
      text: `SELECT ring.id AS value, 
      ring.name || ' (' || STRING_AGG(breed.name, ', ') || ')' AS label
      FROM "ring"
      LEFT JOIN "ring_breed" ON ring.id = ring_breed.ring_id
      LEFT JOIN "breed" ON breed.id = ring_breed.breed_id
      GROUP BY ring.id;`
    }
    const result = await pool.query(query);
    res.json(result.rows);
  }catch(error) {
    console.error('Error searching in database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/admin/new_application', async(req, res) =>{
  const {dog_id, ring_id, status} = req.body
  try{
    const existingApplication = await pool.query('SELECT * FROM "application" WHERE dog_id = $1 AND ring_id = $2', [parseInt(dog_id), parseInt(ring_id)]);
    if (existingApplication.rows.length > 0) {
      return res.status(400).json({ error: 'Application already exists' });
    }
    const query={
      text: `INSERT INTO "application" (dog_id, ring_id, status) VALUES ($1, $2, $3);`,
      values: [parseInt(dog_id), parseInt(ring_id), status]
    }
    await pool.query(query);
    res.status(201).json({message: 'Application created successfully'});
  }catch(error){
    console.error('Error registering application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/admin/experts', async(req, res) =>{
  try{
    const query={
      text: `SELECT expert_ring.id, CONCAT(u.surname, ' ', u.name, ' ', u.patronymic) AS fio,
      expert_breed.name AS expert_specialization, ring.name AS ring,
      ARRAY_AGG(DISTINCT r_br.name) AS ring_specialization, expert_ring.status FROM "expert_ring"
      LEFT JOIN "expert" ON expert.id = expert_ring.expert_id
      LEFT JOIN "breed" expert_breed ON expert_breed.id = expert.breed_id
      LEFT JOIN "user" u ON u.id = expert.user_id
      LEFT JOIN "ring" ON ring.id = expert_ring.ring_id
      LEFT JOIN "ring_breed" ON ring.id = ring_breed.ring_id
      LEFT JOIN "breed" r_br ON ring_breed.breed_id = r_br.id
      GROUP BY expert_ring.id, fio, expert_breed.name, ring.name, ring.address, expert_ring.status;`
    }
    const result = await pool.query(query);
    res.json(result.rows);
  }catch(error){
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/admin/experts_app', async(req, res) =>{
  try{
    const query={
      text: `SELECT expert.id AS value, 
      CONCAT(u.surname, ' ', u.name, ' ', u.patronymic, ' (' , breed.name , ')') AS label
      FROM "expert"
      LEFT JOIN "user" u ON expert.user_id = u.id
      LEFT JOIN "breed" ON breed.id = expert.breed_id;`
    }
    const result = await pool.query(query);
    res.json(result.rows);
  }catch(error) {
    console.error('Error searching in database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})
app.post('/admin/add_expert', async(req, res)=>{
  const {expert_id, ring_id, status} = req.body
  try{
    const existingApplication = await pool.query('SELECT * FROM "expert_ring" WHERE expert_id = $1 AND ring_id = $2', [parseInt(expert_id), parseInt(ring_id)]);
    if (existingApplication.rows.length > 0) {
      return res.status(400).json({ error: 'Application already exists' });
    }
    const query={
      text: `INSERT INTO "expert_ring" (expert_id, ring_id, status) VALUES ($1, $2, $3);`,
      values: [parseInt(expert_id), parseInt(ring_id), status]
    }
    await pool.query(query);
    res.status(201).json({message: 'Application created successfully'});
  }catch(error){
    console.error('Error registering application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.put('/admin/reject_expert', async(req, res) =>{
  const expert_ring_id = req.query.id
  try {
    await pool.query('BEGIN');

    const rejectStatusQuery = {
      text: `UPDATE "expert_ring" SET "status" = 'Отклонено'  WHERE id = $1`,
      values: [parseInt(expert_ring_id)]
    };
    await pool.query(rejectStatusQuery);

    await pool.query('COMMIT');
    res.status(204).json({ message: 'Status updated successfully' });

  } catch (error) {
    await pool.query('ROLLBACK')
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/admin/approve_expert', async(req, res) =>{
  const expert_ring_id = req.query.id
  try {
    await pool.query('BEGIN');

    const approveStatusQuery = {
      text: `UPDATE "expert_ring" SET "status" = 'Одобрено' WHERE id = $1`,
      values: [parseInt(expert_ring_id)]
    };
    await pool.query(approveStatusQuery);

    await pool.query('COMMIT');
    res.status(204).json({ message: 'Status updated successfully' });

  } catch (error) {
    await pool.query('ROLLBACK')
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Эксперт

app.get('/expert/rings', async(req, res) => {
  try{
    const query={
      text: `SELECT ring.id, ring.name, ring.address, ARRAY_AGG(breed.name) as specialization FROM "ring"
      FULL JOIN "ring_breed" ON ring.id = ring_breed.ring_id
      LEFT JOIN "breed" ON breed.id = ring_breed.breed_id
	    GROUP BY ring.id, ring.name, ring.address;`
    }
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  }catch(error){
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/expert/new_application', async (req, res) => {
  const user_id = req.query.expert_id;
  const ring_id = req.query.ring_id;

  const parsedUserId = parseInt(user_id, 10);
  const parsedRingId = parseInt(ring_id, 10);

  try {
    const expertResult = await pool.query(`SELECT expert.id FROM "expert" WHERE user_id = $1`, [parsedUserId]);
    
    if (expertResult.rows.length === 0) {
      return res.status(404).json({ error: 'Expert not found' });
    }

    const expert_id = expertResult.rows[0].id;
    const existingPairResult = await pool.query(
      `SELECT * FROM "expert_ring" WHERE expert_id = $1 AND ring_id = $2`,
      [expert_id, parsedRingId]
    );

    if (existingPairResult.rows.length > 0) {
      return res.status(409).json({ error: 'This expert-ring pair already exists' });
    }
    const query = {
      text: `INSERT INTO "expert_ring" (expert_id, ring_id) VALUES ($1, $2)`,
      values: [expert_id, parsedRingId]
    };

    await pool.query(query);
    res.status(201).json({ message: 'Application created successfully' });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/expert/participants', async(req, res)=>{
  const userId = req.query.id;
  try{
    const expertResult = await pool.query(`SELECT expert.id FROM "expert" WHERE user_id = $1`, [parseInt(userId)]);
    
    if (expertResult.rows.length === 0) {
      return res.status(404).json({ error: 'Expert not found' });
    }

    const expert_id = expertResult.rows[0].id;
    const query={
      text: `SELECT DISTINCT dog.id AS id, dog.name AS nickname, CONCAT(u.surname, ' ', SUBSTRING(u.name, 1, 1), '. ', SUBSTRING(u.patronymic, 1, 1)) AS fio,
      breed.name AS breed, dog.age AS age, ring.name AS ring FROM "application"
     LEFT JOIN "dog" ON application.dog_id = dog.id
     LEFT JOIN "breed" ON dog.breed_id = breed.id
     LEFT JOIN "user" u ON u.id = dog.user_id
     LEFT JOIN "expert_ring" ON expert_ring.ring_id = application.ring_id
     LEFT JOIN "ring" ON expert_ring.ring_id = ring.id
     WHERE expert_id = $1 AND expert_ring.status = 'Одобрено' AND application.status = 'Одобрено';`,
     values: [expert_id]
    }
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  }catch(error){
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/expert/add_mark', async(req, res) =>{
  const { dog_id, user_id } = req.query;
    const { criterion1, criterion2, criterion3, criterion4, criterion5 } = req.body;

    try {
        const expertResult = await pool.query('SELECT expert.id FROM "expert" WHERE user_id = $1', [user_id]);
        const expertId = expertResult.rows[0].id;

        await pool.query(
            'INSERT INTO "mark" (dog_id, expert_id, criterion_id, value) VALUES ($1, $2, $3, $4), ($1, $2, $5, $6), ($1, $2, $7, $8), ($1, $2, $9, $10), ($1, $2, $11, $12)',
            [dog_id, expertId, 1, criterion1, 2, criterion2, 3, criterion3, 4, criterion4, 5, criterion5]
        );

        res.status(201).json({ message: 'Марки успешно добавлены' });
    } catch (error) {
        console.error('Ошибка при добавлении марок:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
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

app.get('/rings', async(req, res) =>{
  try{
    const query={
      text: `SELECT ring.id AS value, ring.name || ' (' || STRING_AGG(breed.name, ', ') || '), ' || ring.address AS label AS label FROM "ring"
      LEFT JOIN "ring_breed" ON ring.id = ring_breed.ring_id
      LEFT JOIN "breed" ON breed.id = ring_breed.breed_id
      GROUP BY ring.id;`
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


