import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import style from './SignIn.module.css'
import { useForm } from 'react-hook-form';
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
  const [overlay, getOverlay] = useState(true)

  const handleClick =()=>{
    getOverlay(!overlay)
  }
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = async(data) => {
        const new_data ={
            name: data.name,
            surname: data.surname,
            patronymic: data.patronymic,
            login: data.login,
            password: data.password
        }
        try{
            const response = await axios.post('http://localhost:8082/register', new_data);
            console.log(response)
        }
        catch (error){
            console.error('Error searching:', error);
        }; //отправка запроса на бэк
    }
  return (
    <>
    <div className={style.container}>
    <div className={style.content}>
      <div className={style.nav}>
        <div onClick={handleClick} className={`${(overlay) && style.active}`}>Войти</div>
        <span>/</span>
        <div onClick={handleClick} className={`${(!overlay) && style.active}`}>Зарегистрироваться</div>
      </div>
      {overlay?
        (<div className={style.main}>
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
          </div>):
        (<form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Введите Имя" {...register("name", {required: true, maxLength: 100})} />
        <input type='text' placeholder='Введите Фамилию' {...register("surname", {required: true, maxLength: 100})} />
        <input type='text' placeholder='Введите Отчество' {...register("patronymic", {maxLength: 100})} />
        <input type="text" placeholder="Введите логин" {...register("login", {required: true})} />
        <input type="password" placeholder="Введите пароль" {...register("password", {required: true, minLength: 6, pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/})} />
        {errors.password && <span>Пароль должен состоять из букв латинского алфавита, содержать цифры и спец. символы</span>}
        <input type="password" placeholder="Повторите пароль"  {...register('confirmPassword', { required: true })}/>
        {errors.confirmPassword && <span>Необходимо повторить пароль</span>}
        {watch('password') !== watch('confirmPassword') && <span style={{margin: '0'}}> Пароли не совпадают</span>}

        <button type="submit">Зарегистрироваться</button>
        </form>)
      }
      
      </div>
  </div>
    </>

  )
}

export default SignIn

