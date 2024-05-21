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

  const token = jwt.sign(payload, '123', { expiresIn: '1h' }); 

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
      text: `SELECT dog.id, dog.name, age, breed.name as breed, club_id, vaccination, 
      ARRAY_AGG(image) as images FROM "dog" F
      ULL JOIN "photo" ON dog.id = photo.dog_id  
      LEFT JOIN "breed" ON breed.id = dog.breed_id WHERE user_id = $1 
      GROUP BY dog.id, dog.name, age, breed.name, club_id, vaccination;`,
      values: [searchId],
    };
    const result = await pool.query(query);
    res.json(result.rows);
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

app.put('/edit_dog', async (req, res) => {
  try{

    res.status(204).json({message: 'Dog successfully updated'})
  }catch(error){
    
  }
})


// Маршруты для администратора
app.get('/admin/recipients', async(req, res)=>{
  try{
    const query ={
      text: `SELECT application.id, dog.name, CONCAT(u.surname, ' ', u.name, ' ', u.patronymic) AS fio, dog.age, breed.name AS breed, 
      club.name AS club, ring.name AS ring, application.status, COUNT(reward_id) FROM "application" 
      LEFT JOIN "dog" ON application.dog_id = dog.id 
      LEFT JOIN "breed" ON dog.breed_id = breed.id 
      LEFT JOIN "club" ON dog.club_id = club.id 
      LEFT JOIN "user" u ON dog.user_id = u.id 
      LEFT JOIN "ring" ON ring.id = application.ring_id 
      LEFT JOIN "dog_reward" ON dog.id = dog_reward.dog_id 
      GROUP BY dog.id, dog.name, fio, dog.age, breed, club, ring, application.status`,
    }
    const result = await pool.query(query);
    res.json(result.rows);
  }catch(error){
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.put('/admin/update_status', async(req, res)=>{})
app.post('/admin/add_application', async(req, res)=>{})

app.get('/admin/rings', async(req, res)=>{
  try{
    const query={
      text: `SELECT ring.id, ring.name, ring.address, ARRAY_AGG(breed.name) as specialization, 
      ARRAY_AGG(CONCAT(u.surname, ' ', u.name, ' ', u.patronymic)) as experts FROM "ring"
      FULL JOIN "ring_breed" ON ring.id = ring_breed.ring_id
      LEFT JOIN "breed" ON breed.id = ring_breed.breed_id
      FULL JOIN "expert_ring" ON ring.id = expert_ring.ring_id
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

app.post('admin/new_ring', async(req, res)=>{
  try{
    const {name, address} = req.body
    await pool.query(`INSERT INTO "ring" (name, address) VALUES ($1, $2);`, [name, address])
  }catch(error){
    res.status(500).json({ error: 'Internal server error' });
  }
})
//INSERT INTO "ring" (name, address) VALUES ($1, $2);

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


