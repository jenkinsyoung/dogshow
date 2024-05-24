import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import style from './Header.module.css';
const HeaderUser = () => {
    const navigate = useNavigate()
    const logout = () =>{
        localStorage.removeItem('token');
        navigate('/')
    }
  return (
    <header>

        <NavLink to="/home">
            <img className={style.image} src='/logo.png' alt=''/>
        </NavLink>
             
        <nav className={style.navbar}>
                <li>
                    <NavLink 
                        to="/home/pets" 
                        className={({ isActive }) => isActive ? style.activeLink : undefined}
                    >
                        Мои питомцы
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/home/rings" 
                        className={({ isActive }) => isActive ? style.activeLink : undefined}
                    >
                        Ринги
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/home/experts" 
                        className={({ isActive }) => isActive ? style.activeLink : undefined}
                    >
                        Эксперты
                    </NavLink>
                </li>
        </nav>
        <NavLink to="/profile">
                <img className={style.profile} src='/profile.svg' alt=''/>
        </NavLink>
        <img className={style.out} onClick={logout} src='/logout.svg' alt=''/>
    </header>
  )
}

export default HeaderUser