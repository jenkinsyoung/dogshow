import React, { useEffect, useState } from 'react'
import style from './MyPetsPage.module.css'
import HeaderUser from '../../components/HeaderUser'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import Dog from '../../components/Dog'
import AddDog from '../../components/AddDog'
import { useNavigate } from 'react-router-dom'
const MyPetsPage = () => {
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
            <Pets />
        </main>
    </div>
  )
}

export default MyPetsPage

const Pets =() =>{
    const [dogs, setDogs] =useState([])
    const [userId, setUserId] = useState('')
    const [overlay, setOverlay] = useState(false)
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
        }
    }, [])
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const data = await axios.get(`http://localhost:8082/dogs?userId=${userId}`);
                setDogs(data.data); // Предполагая, что данные возвращаются в формате { data: [...] }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);

    const handleAdd =()=>{
        setOverlay(!overlay);
    }

    return(
        <>
        {overlay? <AddDog params={userId}/> : <></>}
        <div className={style.menu_btn}>
            <div>
                <button className={style.add} onClick={handleAdd}>Добавить питомца</button>
                
                <button className={style.add}>Фильтры для поиска</button>
            </div>
            
            <div>
                <button className={style.join}>Подать завку на участие</button>
                <button className={style.delete}>Удалить</button>
            </div>
            
        </div>
        
            {dogs.length ? dogs.map(dog=><Dog dog={dog} />) : <div style={{width: '100%', textAlign: 'center', fontSize: '20px', color: '#B4A59F'}}>У вас не добавлен ни один питомец</div>}
        </>
    )
}