import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import style from './Header.module.css';
const HeaderAdmin = () => {
    const navigate = useNavigate()
    const logout = () =>{
        localStorage.removeItem('token');
        navigate('/')
    }
  return (
    <header>

            <Link to="/admin"><img className={style.image} src='/logo.png' alt=''/></Link>
             
            <nav className={style.navbar}>
                    <li>
                        <Link to="/admin/participants">Участники</Link>
                    </li>
                    <li>
                        <Link to="/admin/clubs">Клубы</Link>
                    </li>
                    <li>
                        <Link to="/admin/rings">Ринги</Link>
                    </li>
                    <li>
                        <Link to="/admin/experts">Эксперты</Link>
                    </li>
            </nav>
            <Link to="/profile"><img className={style.profile} src='/profile.svg' alt=''/></Link>
            <img className={style.out} onClick={logout} src='/logout.svg' alt=''/>
        </header>
  )
}

export default HeaderAdmin