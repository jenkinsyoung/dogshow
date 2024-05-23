import React, {useEffect, useState} from 'react'
import style from './ExpertParticipantPage.module.css';
import HeaderExpert from '../../components/HeaderExpert';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

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
    
}