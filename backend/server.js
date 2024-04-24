const express = require('express');
const app = express();
const port = 8082; // Порт, на котором будет работать ваш сервер

// Определение маршрутов
app.get('/', (req, res) => {
  res.send('Привет, мир!');
});

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

pool.query(`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';
`, (err, res) => {
  if (err) {
    console.error('Ошибка при выполнении запроса:', err.stack);
  } else {
    console.log('Список таблиц:', res.rows);
  }
  pool.end();
});
