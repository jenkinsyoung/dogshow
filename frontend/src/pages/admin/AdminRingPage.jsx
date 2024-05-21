import React, { useEffect, useState } from 'react'
import HeaderAdmin from '../../components/HeaderAdmin'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import style from './AdminRingPage.module.css'
import { useNavigate } from 'react-router-dom'
import Checkbox from '../../components/Checkbox'
const AdminRingPage = () => {
    const navigate=useNavigate();
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            const decodedToken = jwtDecode(token);
            if(decodedToken.role_id !== "1") navigate("/forbidden");
        }
    })
  return (
    <div className='page'>
        <HeaderAdmin />
        <main>
            <RingPage />
        </main>
    </div>
  )
}

export default AdminRingPage

const RingPage =()=>{
    const [rings, setRing] = useState([])
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const data = await axios.get(`http://localhost:8082/admin/rings`);
                setRing(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData()
        
    }, [])
    const [checkedItems, setCheckedItems] = useState([]);

  const handleCheckBoxChange = (index) => {
    setCheckedItems(prevState => {
      if (prevState.includes(index)) {
        return prevState.filter(item => item !== index);
      } else {
        return [...prevState, index];
      }
    });
  };
    return(
        <div className={style.container}>
            <div className={style.menu}>
                <button className={style.add}>Создать новый ринг</button>
                <button className={style.delete}>Удалить ринг</button>
            </div>
            <div className={style.table}>
                <table>
                    <tr className={style.title}>
                        <td></td>
                        <td>Название ринга</td>
                        <td>Адрес</td>
                        <td>Специализация ринга</td>
                        <td>Эксперты ринга</td>
                        <td>Карточка ринга</td>
                    </tr>
            {rings.map(el=><tr className={style.line} key={el.id}> 
                <td className={style.check}>
                    <Checkbox key={el.id}
                        index={el.id}
                        onChange={handleCheckBoxChange}/>
                </td>
                <td>{el.name}</td>
                <td>{el.address}</td>
                <td>{el.specialization}</td>
                <td>{el.experts}</td>
                <td className={style.card}>Открыть карточку</td>
                </tr>)}
                </table>

                {checkedItems}
            </div>
        </div>
    )
}