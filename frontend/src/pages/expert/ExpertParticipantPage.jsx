import React, {useEffect, useState} from 'react'
import style from './ExpertParticipantPage.module.css';
import HeaderExpert from '../../components/HeaderExpert';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
const ExpertParticipantPage = () => {
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
            <ExpertParticipant />
        </main>
        </div>
    </>
    )
}

export default ExpertParticipantPage

const ExpertParticipant =()=>{
    const [overlay, setOverlay] = useState(false)
    const [participants, setParticipant] = useState([])
    useEffect(()=>{
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const user_id = decodedToken.userId;
        const fetchData = async () => {
            try {
                const data = await axios.get(`http://localhost:8082/expert/participants?id=${user_id}`);
                setParticipant(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData()   
    }, [])

    return(
        <div className={style.container}>
            {/* {overlay?<AddMark /> : <></>} */}
            <div className={style.table}>
                <table>
                    <tr className={style.title}>
                        <td>Кличка собаки <img src='/triangle.svg' alt=''/></td>
                        <td>Порода <img src='/triangle.svg' alt=''/></td>
                        <td>Возраст</td>
                        <td>ФИО хозяина <img src='/triangle.svg' alt=''/></td>
                        <td>Ринг</td>
                        <td>Карточка</td>
                    </tr>
            {participants.map(el=><tr className={style.line} key={el.id}> 
                <td>{el.nickname}</td>
                <td>{el.breed}</td>
                <td>{el.age}</td>
                <td>{el.fio}</td>
                <td>{el.ring}</td>
                <td className={style.card}>Открыть карточку</td>
                </tr>)}
                </table>
            </div>
        </div>
    )
}