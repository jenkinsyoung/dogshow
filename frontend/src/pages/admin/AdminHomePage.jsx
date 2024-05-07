import React, {useEffect, useState, createRef} from 'react'
import { Link } from 'react-router-dom';
import style from './AdminHomePage.module.css';
import Podium from '../../components/Podium';
import { getTodayDate } from '../../utils/time';
import Countdown from '../../components/Timer';
const AdminPage = () => {
    return(
        <>
        <header>

                <Link to="/home"><img className={style.image} src='/logo.png' alt=''/></Link>
             
            <nav className={style.navbar}>
                    
                    {/* <div>BarkFest</div> */}
                    <li>
                        <Link to="/home/participants">Участники</Link>
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
            <Home />
        </main>
    </>
    )
}

export default AdminPage

const Home = () => {
    const todayDate = getTodayDate();
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
            <div className={style.date}>{todayDate}</div>
            <div className={style.info}>Время до начала выставки</div>
            <div className={style.timer}><Countdown /></div>
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
    <input type="hidden" min="0" max="100" value={value} onChange={(e) => setValue(parseInt(e.target.value))} />
     <div>
     <img src="/line.svg" alt="" className={style.line} />
     </div>
     <div className={style.rewards}>
        <h1>Наши победители</h1>
        <Podium />
     </div>
    </>
 )
}
