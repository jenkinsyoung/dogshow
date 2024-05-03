import React from 'react';
import { useForm } from 'react-hook-form';
import style from './SignUp.module.css'
import axios from 'axios';
const SignUp = () => {

    
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
            const response = await axios.post('http://localhost:8082/user', new_data);
            console.log(response)
        }
        catch (error){
            console.error('Error searching:', error);
        }; //отправка запроса на бэк
    }
  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.nav}>
          <div>Войти</div>
          <span>/</span>
          <h1>Зарегистрироваться</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
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
        </form>
    </div>
    </div>
  )
}

export default SignUp