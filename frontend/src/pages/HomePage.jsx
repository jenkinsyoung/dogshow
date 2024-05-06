import React, {useEffect, useState, createRef} from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Routes
} from 'react-router-dom';
import style from './HomePage.module.css';
import Slider from '../components/Slider';
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
    const [value, setValue] = useState(0); // Используем state для хранения значения input
    const pieChartRef = createRef(); // Создаем ref для доступа к элементу .pie-chart

  useEffect(() => {
    document.querySelector('input').addEventListener('input', function() {
      if (pieChartRef.current) {
        pieChartRef.current.style.setProperty('--value', this.value + '%');
      }
    });
  });
 return(
    <>
    
    <div className={style.statistic}>
        <div className={style.first}>
            
            <div className={style.pieChart} ref={pieChartRef}>
            <div className={style.circle}>
                <div>С нами уже</div>
                <span className={style.cnt}>10000</span>
                <div>участников</div>
            </div>
            </div>
        </div>
        <div className={style.second}>
            <div className={style.date}>27 апреля 2024</div>
            <div className={style.info}>Время до начала выставки</div>
            <div className={style.timer}>00:00:00</div>
            <div className={`${style.info}  && ${style.in}`}>Дата начала выставки: <span>15.06.2024</span></div>
            <div className={`${style.info}  && ${style.in}`}>Количество рингов: <span>20</span></div>
            <button>Принять участие</button>

        </div>
        <div className={style.third}>
        <div className={style.pieChart} ref={pieChartRef}>
            <div className={style.circle}>
                <div>С нами уже</div>
                <span className={style.cnt}>127</span>
                <div>экспертов</div>
            </div>
            </div>
        </div>
    
    </div>  
    <label>
            <span>Значение (%)</span>
            <input type="number" min="0" max="100" value={value} onChange={(e) => setValue(parseInt(e.target.value))} />
     </label>
     <div>
     <Slider />
     </div>
     
    </>
 )
}

const About = () => {
    return(
       <h2>О</h2>
    )
}