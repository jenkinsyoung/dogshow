import React, { useEffect, useState } from 'react'
import style from './MyPetsPage.module.css'
import HeaderUser from '../../components/HeaderUser'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import Dog from '../../components/Dog'
const MyPetsPage = () => {
  return (
        <>
        <HeaderUser />
        <main>
            <Pets />
        </main>
    </>
  )
}

export default MyPetsPage

const Pets =() =>{
    const [dogs, setDogs] =useState([])
    const [userId, setUserId] = useState('')
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

    return(
        <>
        <div className={style.menu_btn}>
            <div>
                <button className={style.add}>Добавить питомца</button>
                <button className={style.add}>Фильтры для поиска</button>
            </div>
            <div>
                <button className={style.join}>Подать завку на участие</button>
                <button className={style.delete}>Удалить</button>
            </div>
            
        </div>
            
            {dogs.length ? dogs.map(dog=><Dog dog={dog} />) : <div>У вас не добавлен ни один питомец</div>}
        </>
    )
}