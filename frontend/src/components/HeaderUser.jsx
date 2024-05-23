import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import style from './Header.module.css';
const HeaderUser = () => {
    const navigate = useNavigate()
    const logout = () =>{
        localStorage.removeItem('token');
        navigate('/')
    }
  return (
    <header>

                <Link to="/home"><img className={style.image} src='/logo.png' alt=''/></Link>
             
            <nav className={style.navbar}>
                    
                    {/* <div>BarkFest</div> */}
                    <li>
                        <Link to="/home/pets">Мои питомцы</Link>
                    </li>
                    <li>
                        <Link to="/rings">Ринги</Link>
                    </li>
                    <li>
                        <Link to="/experts">Эксперты</Link>
                    </li>
            </nav>
            <Link to="/profile"><img className={style.profile} src='/profile.svg' alt=''/></Link>
            <img className={style.out} onClick={logout} src='/logout.svg' alt=''/>
        </header>
  )
}

export default HeaderUser