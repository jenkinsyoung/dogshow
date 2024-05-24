import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import HeaderAdmin from '../../components/HeaderAdmin';
import axios from 'axios'
import style from './AdminParticipantPage.module.css'
import Checkbox from '../../components/Checkbox'
import AddParticipant from '../../components/AddParticipant';
const AdminParticipantPage = () => {
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
           <AdminParticipant />
        </main>
    </div>
    )
}

export default AdminParticipantPage

const AdminParticipant =() =>{
    const [overlay, setOverlay] = useState(false)
    const [participants, setParticipant] = useState([])
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const data = await axios.get(`http://localhost:8082/admin/participants`);
                setParticipant(data.data);
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

  const handleReject=async (checkedItems)=>{
    async function updateData(id){
        try{
            await axios.put(`http://localhost:8082/admin/reject_status?id=${id}` )
        }catch(error){
            console.log(error)
        }
    }
    if (checkedItems.length !== 0){
        await Promise.all(checkedItems.map(id => updateData(id)));
        window.location.reload();
    }

    else{alert('Не выбран участник')}

  }
  const handleApprove =async(checkedItems)=>{
    async function updateData(id){
        try{
            await axios.put(`http://localhost:8082/admin/approve_status?id=${id}` )
        }catch(error){
            console.log(error)
        }
    }
    if (checkedItems.length !== 0){
        await Promise.all(checkedItems.map(id => updateData(id)));
        window.location.reload();
    }

    else{alert('Не выбран участник')}

  }
    return(
        <div className={style.container}>
            {overlay?<AddParticipant /> : <></>}
            <div className={style.btn}>
            <button className={style.participant} onClick={()=>setOverlay(!overlay)}>Добавить нового участника</button>
            <div className={style.menu}>
                <button className={style.add} onClick={()=>handleApprove(checkedItems)}>Одобрить заявку</button>
                <button className={style.delete} onClick={() => handleReject(checkedItems)}>Отклонить заявку</button>
            </div>
            </div>
            <div className={style.table}>
                <table>
                    <tr className={style.title}>
                        <td></td>
                        <td>Кличка собаки <img src='/triangle.svg' alt=''/></td>
                        <td>Порода <img src='/triangle.svg' alt=''/></td>
                        <td>Возраст</td>
                        <td>ФИО хозяина <img src='/triangle.svg' alt=''/></td>
                        <td>Ринг <img src='/triangle.svg' alt=''/></td>
                        <td>Специализация ринга</td>
                        <td>Кол-во наград <img src='/triangle.svg' alt=''/></td>
                        <td>Статус заявки <img src='/triangle.svg' alt=''/></td>
                    </tr>
            {participants.map(el=><tr className={style.line} key={el.id}> 
                <td className={style.check}>
                    <Checkbox key={el.id}
                        index={el.id}
                        onChange={handleCheckBoxChange}/>
                </td>
                <td>{el.nickname}</td>
                <td>{el.breed}</td>
                <td>{el.age}</td>
                <td>{el.fio}</td>
                <td>{el.ring}</td>
                <td>{el.specialization.map(e=><div style={{display: 'flex'}}><span style={{color: 'rgb(255, 181, 167)'}}>◆</span> {e} </div>)}</td>
                <td>{el.reward_cnt}</td>
                <td>{el.status}</td>
                </tr>)}
                </table>
            </div>
        </div>
    )
}