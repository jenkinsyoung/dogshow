import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import style from './SignIn.module.css'
import { useForm } from 'react-hook-form';
import { useNavigate} from 'react-router-dom';
import{ jwtDecode} from 'jwt-decode';
const SignIn = () => {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin =async () => {
    try {
      await axios.get(`http://localhost:8082/auth?login=${login}`).then(data=>
        {
          localStorage.setItem('token', data.data.token);
        }
      );
      const token = localStorage.getItem('token')
      if(token){
        const decodedToken = jwtDecode(token);
        const role_id = decodedToken.role_id;
        const pass = decodedToken.password;

      if( password === pass) {
        setLoggedIn(true);
        if(role_id === '2') navigate('/home')
        else if(role_id === '3') navigate('/expert')
        else navigate('/admin')
      }
      else {setError('Неверное имя пользователя или пароль');}}
    } catch (error) {
      console.error('Error searching:', error);
    }
  };


  const [overlay, getOverlay] = useState(true)

  const handleClick =()=>{
    getOverlay(!overlay)
  }
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = async(data) => {
      if (data.role_id === "0"){setError('Не выбрана роль')}
      else{const new_data ={
        name: data.name,
        surname: data.surname,
        patronymic: data.patronymic,
        login: data.login,
        password: data.password,
        role_id: data.role_id
    }
    try{
        await axios.post('http://localhost:8082/register', new_data)
        .then(data=>{
          localStorage.setItem('token', data.data.token);
        });
        
        navigate("/")
    }
    catch (error){
        console.error('Error searching:', error);
    }; 
}}
        
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
              <div></div>
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
        <select style ={{color: 'rgb(98, 90, 87)'}} {...register("role_id", {required: true})} >
          <option value="0">Выберите роль</option>
          <option style ={{color: 'rgb(98, 90, 87)'}}value="2">Хозяин собаки</option>
          <option style ={{color: 'rgb(98, 90, 87)'}}value="3">Эксперт</option>
        </select>
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

