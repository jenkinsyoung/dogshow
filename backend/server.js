const express = require('express');
const app = express();
const cors = require('cors');
const port = 8082; // Порт, на котором будет работать ваш сервер
app.use(cors());
app.use(express.json())

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

    // Подготавливаем SQL-запрос с параметрами
    const query = {
      text: 'SELECT * FROM "user" WHERE login ILIKE $1',
      values: [`%${searchLogin}%`],
    };

    // Выполняем запрос к базе данных
    const result = await pool.query(query);

    // Отправляем найденные данные клиенту
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

app.get('/dogs', async(req, res) =>{
  const ownerId = req.query.userId;
  try{
    const searchId = parseInt(ownerId);

    // Подготавливаем SQL-запрос с параметрами
    const query = {
      text: 'SELECT dog.id, dog.name, age, breed.name as breed, club_id, vaccination from "dog" LEFT JOIN "breed" ON breed.id = dog.breed_id WHERE user_id = $1',
      values: [searchId],
    };
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


