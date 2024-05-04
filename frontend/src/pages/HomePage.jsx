import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Routes
} from 'react-router-dom';
import style from './HomePage.module.css';
const HomePage = () => {
    return(
    <Router>
        <header>

                <Link to="/"><img className={style.image} src='/logo.png' alt=''/></Link>
             
            <nav className={style.navbar}>
                    
                    {/* <div>BarkFest</div> */}
                    <li>
                        <Link to="/participants">Участники</Link>
                    </li>
                    <li>
                        <Link to="/clubs">Клубы</Link>
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
            <Routes>
                <Route path="/participants" element={<About />}/>
                <Route path="/clubs" element={<About />}/>
                <Route path="/rings"element={<About />}/>
                <Route path="/experts" element={<About />}/>
                <Route path="/" element={<Home />} />
            </Routes>
        </main>
    </Router>
    )
}

export default HomePage


const Home = () => {
 return(
    <h2>Главная</h2>
 )
}

const About = () => {
    return(
       <h2>О</h2>
    )
}