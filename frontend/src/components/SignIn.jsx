import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import style from './SignIn.module.css'
const SignIn = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [login, setLogin] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleLogin =async () => {
    try {
      const response = await axios.get(`http://localhost:8082/auth?login=${login}`);
      const compare = response.data[0]
      if( password === compare.password) {
        setLoggedIn(true);
        const name = compare.name +' '+ compare.patronymic;
        setUsername(name)
      }
      else {setError('Неверное имя пользователя или пароль');}
    } catch (error) {
      console.error('Error searching:', error);
    }
  };


const handleLogout = () => {
  setLoggedIn(false);
  setLogin('');
  setPassword('');
  setError('');
}
  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.nav}>
          <h1>Войти</h1>
          <span>/</span>
          <div>Зарегистрироваться</div>
        </div>
        <div className={style.main}>
        {loggedIn ? (
            <div>
              <h2>Добро пожаловать, {username}!</h2>
              <button onClick={handleLogout}>Выйти</button>
            </div>
          ) : (
            <>
            {error && <p>{error}</p>}
              <input
                type="text"
                placeholder="Введите логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
              <input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className={style.btn} onClick={handleLogin}>Войти</button>
              
            </>
          )}
        </div>
        </div>
    </div>

  )
}

export default SignIn

