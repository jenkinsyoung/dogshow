import React, { useEffect, useState } from 'react'
import HeaderAdmin from '../../components/HeaderAdmin'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import style from './AdminRingPage.module.css'
import { useNavigate } from 'react-router-dom'
import Checkbox from '../../components/Checkbox'
import AddRing from '../../components/AddRing'
const AdminRingPage = () => {
    const navigate = useNavigate();
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
    const [overlay, setOverlay] = useState(false)
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

  const handleDelete=async (checkedItems)=>{
    async function deleteData(id){
        try{
            await axios.delete(`http://localhost:8082/admin/delete_ring?id=${id}` )
        }catch(error){
            console.log(error)
        }
    }
    if (checkedItems.length !== 0){
        await Promise.all(checkedItems.map(id => deleteData(id)));
        window.location.reload();
    }

    else{alert('Не выбран ринг для удаления')}

  }
    return(
        <div className={style.container}>
            {overlay?<AddRing /> : <></>}
            <div className={style.menu}>
                <button className={style.add} onClick={()=>setOverlay(!overlay)}>Создать новый ринг</button>
                <button className={style.delete} onClick={() => handleDelete(checkedItems)}>Удалить ринг</button>
            </div>
            <div className={style.table}>
                <table>
                    <tr className={style.title}>
                        <td></td>
                        <td>Название ринга <img src='/triangle.svg' alt=''/></td>
                        <td>Адрес</td>
                        <td>Специализация ринга <img src='/triangle.svg' alt=''/></td>
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
                <td>{el.specialization.map(e=><>{e} </>)}</td>
                <td>{el.experts}</td>
                <td className={style.card}>Открыть карточку</td>
                </tr>)}
                </table>
            </div>
        </div>
    )
}