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
                    
                    {/* <div>BarkFest</div> */}
                    <li>
                        <Link to="/expert/pets">Участники</Link>
                    </li>
                    <li>
                        <Link to="/expert/clubs">Клубы</Link>
                    </li>
                    <li>
                        <Link to="/rings">Ринги</Link>
                    </li>
            </nav>
            <Link to="/profile"><img className={style.profile} src='/profile.svg' alt=''/></Link>
            <img className={style.out} onClick={logout} src='/logout.svg' alt=''/>
        </header>
  )
}

export default HeaderExpert