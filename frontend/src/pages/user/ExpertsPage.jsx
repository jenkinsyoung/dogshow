import React, {useEffect, useState} from 'react'
import style from './ExpertsPage.module.css';
import HeaderUser from '../../components/HeaderUser';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ExpertUI from '../../components/ExpertUI';
import axios from 'axios';
const ExpertsPage = () => {
    const navigate=useNavigate();
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            const decodedToken = jwtDecode(token);
            if(decodedToken.role_id !== "2") navigate("/forbidden");
        }
    })
  return (
    <div className='page'>
        <HeaderUser />
        <main>
            <Experts />
        </main>
    </div>
  )
}

export default ExpertsPage

const Experts =()=>{
    const [experts, setExperts] = useState([])
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const data = await axios.get(`http://localhost:8082/experts`);
                setExperts(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };


            fetchData();
        
    }, [])
    return(
        <div className={style.container}>
            <div className={style.main_content}>
                {experts.length > 0 ? experts.map(expert => <ExpertUI expert={expert} />) 
                : 
                <div style={{width: '100%', textAlign: 'center', fontSize: '20px', color: '#B4A59F', marginTop:'10px'}}>В базе нет ни одного эксперта</div>}
            </div>
        </div>
    )

}