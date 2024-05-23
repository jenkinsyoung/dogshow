import React, {useEffect, useState} from 'react'
import style from './AdminClubPage.module.css';
import HeaderAdmin from '../../components/HeaderAdmin';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminClubPage =()=> {
    const navigate=useNavigate();
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            const decodedToken = jwtDecode(token);
            if(decodedToken.role_id !== "1") navigate("/forbidden");
        }
    })
    return(
        <div className='page'>
        <HeaderAdmin />
        <main>
           <AdminClub />
        </main>
    </div>
    )
}

export default AdminClubPage

const AdminClub =() =>{
    const [clubs, setClub] = useState([])
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const data = await axios.get(`http://localhost:8082/admin/clubs`);
                setClub(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData()   
    }, [])

    return(
        <div className={style.container}>
            {/* {overlay?<AddParticipant /> : <></>} */}
            <div className={style.table}>
                <table>
                    <tr className={style.title}>
                        <td>Название клуба <img src='/triangle.svg' alt=''/></td>
                        <td>Эксперты клуба </td>
                        <td>Породы <img src='/triangle.svg' alt=''/></td>
                        <td>Награды </td>
                        <td>Карточка</td>
                    </tr>
            {clubs.map(el=><tr className={style.line} key={el.id}> 
                <td>{el.name}</td>
                <td>{el.expert}</td>
                <td>{el.breed}</td>
                <td>{el.reward}</td>
                <td className={style.card}>Открыть карточку</td>
                </tr>)}
                </table>
            </div>
        </div>
    )
}