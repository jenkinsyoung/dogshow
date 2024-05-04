const express = require('express');
const app = express();
const cors = require('cors');
const port = 8082; // Порт, на котором будет работать ваш сервер
app.use(cors());
app.use(express.json())
// Определение маршрутов


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
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching in database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/register', async (req, res) =>{
  try {
    const { name, surname, patronymic, login, password } = req.body;

    // Проверяем, существует ли пользователь с таким именем
    const userExists = await pool.query('SELECT * FROM "user" WHERE login = $1', [login]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const id = (await pool.query('SELECT * FROM "user"')).rowCount + 1
  
    // Добавляем нового пользователя в базу данных
    const newUser = await pool.query('INSERT INTO "user" (id, name, surname, patronymic, login, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [id, name, surname, patronymic, login, password]);

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
)