import React, {useEffect, useState, createRef} from 'react'
import style from './ExpertHomePage.module.css';
import HeaderExpert from '../../components/HeaderExpert';
import Slider from '../../components/Slider';
import Podium from '../../components/Podium';
import { getTodayDate } from '../../utils/time';
import Countdown from '../../components/Timer';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const ExpertHomePage = () => {
    const navigate=useNavigate();
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            const decodedToken = jwtDecode(token);
            if(decodedToken.role_id !== "3") navigate("/forbidden");
        }
    })
    return(
        <>
        <div className='page'>
        <HeaderExpert />
        <main>
            <Home />
        </main>
        </div>
    </>
    )
}

export default ExpertHomePage

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
            <button>Подать заявку</button>

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
     <Slider />
     <img src="/line.svg" alt="" className={style.line} />
     </div>
     <div className={style.rewards}>
        <h1>Наши победители</h1>
        <Podium />
     </div>
    </>
 )
}
