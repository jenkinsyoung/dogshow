import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import style from './Header.module.css';
const HeaderExpert = () => {
    const navigate = useNavigate()
    const logout = () =>{
        localStorage.removeItem('token');
        navigate('/')
    }
  return (
    <header>

                <Link to="/expert"><img className={style.image} src='/logo.png' alt=''/></Link>
             
            <nav className={style.navbar}>
                    <li>
                        <Link to="/expert/participants">Участники</Link>
                    </li>
                    <li>
                        <Link to="/expert/rings">Ринги</Link>
                    </li>
            </nav>
            <Link to="/expert/profile"><img className={style.profile} src='/profile.svg' alt=''/></Link>
            <img className={style.out} onClick={logout} src='/logout.svg' alt=''/>
        </header>
  )
}

export default HeaderExpert