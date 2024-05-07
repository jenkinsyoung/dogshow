import React from 'react'
import { Link } from 'react-router-dom'
import style from './MyPetsPage.module.css'
const MyPetsPage = () => {
  return (
        <>
        <header>

                <Link to="/home"><img className={style.image} src='/logo.png' alt=''/></Link>
             
            <nav className={style.navbar}>
                    
                    {/* <div>BarkFest</div> */}
                    <li>
                        <Link to="/home/pets">Мои питомцы</Link>
                    </li>
                    <li>
                        <Link to="/home/clubs">Клубы</Link>
                    </li>
                    <li>
                        <Link to="/rings">Ринги</Link>
                    </li>
                    <li>
                        <Link to="/experts">Эксперты</Link>
                    </li>
            </nav>
            <Link to="/"><img className={style.profile} src='/profile.svg' alt=''/></Link>
            <Link to="/"><img className={style.out} src='/logout.svg' alt=''/></Link>
        </header>

        <main>
            <Pets />
        </main>
    </>
  )
}

export default MyPetsPage

const Pets =() =>{

    return(
        <>
            <button className={style.add}>Добавить питомца</button>
        </>
    )
}