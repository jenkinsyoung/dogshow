import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import style from './ExpertRingPage.module.css'
import { useNavigate } from 'react-router-dom'
import Checkbox from '../../components/Checkbox'
import HeaderExpert from '../../components/HeaderExpert'
const ExpertRingPage = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            const decodedToken = jwtDecode(token);
            if(decodedToken.role_id !== "3") navigate("/forbidden");
        }
    })
  return (
    <div className='page'>
        <HeaderExpert />
        <main>
            <RingPage />
        </main>
    </div>
  )
}

export default ExpertRingPage

const RingPage =()=>{
    const [rings, setRing] = useState([])
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const data = await axios.get(`http://localhost:8082/expert/rings`);
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
  const [ringId, setRingId] = useState('')
  const handleJoin= async (checkedItems)=>{
    if (checkedItems.length > 1) {alert('Выберите только один ринг')}
    else if (checkedItems.length === 0){alert('Не выбран ринг')}
    else{
        setRingId(checkedItems[0])
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const expert_id = decodedToken.userId;
        console.log(expert_id, ringId)
        try{
            await axios.post(`http://localhost:8082/expert/new_application?expert_id=${expert_id}&ring_id=${ringId}`)
            window.location.reload();
        }catch(error){
            console.log(error)
        }
    }
};
 
    return(
        <div className={style.container}>
            <div className={style.menu}>
                <button className={style.add} onClick={()=>{handleJoin(checkedItems)}}>Подать заявку</button>
            </div>
            <div className={style.table}>
                <table>
                    <tr className={style.title}>
                        <td></td>
                        <td>Название ринга <img src='/triangle.svg' alt=''/></td>
                        <td>Адрес</td>
                        <td>Специализация ринга <img src='/triangle.svg' alt=''/></td>
                    </tr>
            {rings.map(el=><tr className={style.line} key={el.id}> 
                <td className={style.check}>
                    <Checkbox key={el.id}
                        index={el.id}
                        onChange={handleCheckBoxChange}/>
                </td>
                <td>{el.name}</td>
                <td>{el.address}</td>
                <td>{el.specialization.map(e=><div style={{display: 'flex'}}><span style={{color: 'rgb(255, 181, 167)'}}>◆</span> {e} </div>)}</td>
                </tr>)}
                </table>
            </div>
        </div>
    )
}