import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import style from './Header.module.css';
const HeaderExpert = () => {
    const navigate = useNavigate()
    const logout = () =>{
        localStorage.removeItem('token');
        navigate('/')
    }
  return (
    <header>

        <NavLink to="/expert">
            <img className={style.image} src='/logo.png' alt=''/>
        </NavLink>
             
        <nav className={style.navbar}>
            <li>
                <NavLink 
                    to="/expert/participants" 
                    className={({ isActive }) => isActive ? style.activeLink : undefined}
                >
                    Участники
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/expert/rings" 
                    className={({ isActive }) => isActive ? style.activeLink : undefined}
                >
                    Ринги
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

export default HeaderExpert