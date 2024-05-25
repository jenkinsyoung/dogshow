import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import HeaderAdmin from '../../components/HeaderAdmin';
import axios from 'axios'
import style from './AdminExpertPage.module.css'
import Checkbox from '../../components/Checkbox'
import AddExpert from '../../components/AddExpert';

const AdminExpertPage =() =>{
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
           <AdminExpert />
        </main>
    </div>
    )
}

export default AdminExpertPage

const AdminExpert =()=>{
    const [overlay, setOverlay] = useState(false)
    const [experts, setExpert] = useState([])
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const data = await axios.get(`http://localhost:8082/admin/experts`);
                setExpert(data.data);
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
            await axios.put(`http://localhost:8082/admin/reject_expert?id=${id}` )
        }catch(error){
            console.log(error)
        }
    }
    if (checkedItems.length !== 0){
        await Promise.all(checkedItems.map(id => updateData(id)));
        window.location.reload();
    }

    else{alert('Не выбран эксперт')}

  }
  const handleApprove =async(checkedItems)=>{
    async function updateData(id){
        try{
            await axios.put(`http://localhost:8082/admin/approve_expert?id=${id}` )
        }catch(error){
            console.log(error)
        }
    }
    if (checkedItems.length !== 0){
        await Promise.all(checkedItems.map(id => updateData(id)));
        window.location.reload();
    }

    else{alert('Не выбран эксперт')}

  }
    return(
        <div className={style.container}>
            {overlay?<AddExpert /> : <></>}
            <div className={style.btn}>
            <button className={style.participant} onClick={()=>setOverlay(!overlay)}>Добавить нового эксперта</button>
            <div className={style.menu}>
                <button className={style.add} onClick={()=>handleApprove(checkedItems)}>Одобрить заявку</button>
                <button className={style.delete} onClick={() => handleReject(checkedItems)}>Отклонить заявку</button>
            </div>
            </div>
            <div className={style.table}>
                <table>
                    <tr className={style.title}>
                        <td></td>
                        <td>ФИО эксперта</td>
                        <td>Специализация эксперта</td>
                        <td>Ринг</td>
                        <td>Специализация ринга</td>
                        <td>Статус заявки <img src='/triangle.svg' alt=''/></td>
                    </tr>
            {experts.map(el=><tr className={style.line} key={el.id}> 
                <td className={style.check}>
                    <Checkbox key={el.id}
                        index={el.id}
                        onChange={handleCheckBoxChange}/>
                </td>
                <td>{el.fio}</td>
                <td>{el.expert_specialization}</td>
                <td>{el.ring}</td>
                <td>{el.ring_specialization.map(e=><div style={{display: 'flex'}}><span style={{color: 'rgb(255, 181, 167)'}}>◆</span> {e} </div>)}</td>
                {el.status === 'Одобрено'? <td style={{color: 'green'}}>{el.status}</td> : el.status === 'Отклонено'? <td style={{color: 'red'}}>{el.status}</td> : <td>{el.status}</td>}
                
                </tr>)}
                </table>
            </div>
        </div>
    )
}