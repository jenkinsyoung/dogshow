import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import style from './Header.module.css';
const HeaderAdmin = () => {
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
                    to="/admin/participants" 
                    className={({ isActive }) => isActive ? style.activeLink : undefined}
                >
                    Участники
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/admin/rings" 
                    className={({ isActive }) => isActive ? style.activeLink : undefined}
                >
                    Ринги
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/admin/experts" 
                    className={({ isActive }) => isActive ? style.activeLink : undefined}
                >
                    Эксперты
                </NavLink>
            </li>
        </nav>
        <NavLink to="/admin/profile">
            <img className={style.profile} src='/profile.svg' alt=''/>
        </NavLink>
        <img className={style.out} onClick={logout} src='/logout.svg' alt=''/>
    </header>
  )
}

export default HeaderAdmin