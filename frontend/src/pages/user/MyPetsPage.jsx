import React, { useEffect, useState } from 'react'
import style from './MyPetsPage.module.css'
import HeaderUser from '../../components/HeaderUser'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import Dog from '../../components/Dog'
import AddDog from '../../components/AddDog'
import { useNavigate } from 'react-router-dom'
import Checkbox from '../../components/Checkbox'

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
            <Pets/>
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
                const data = await axios.get(`http://localhost:8082/dogs?userId=${userId}` );
                setDogs(data.data);
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
                await axios.delete(`http://localhost:8082/delete_dog?id=${id}` )
            }catch(error){
                console.log(error)
            }
        }
        if (checkedItems.length !== 0){
            await Promise.all(checkedItems.map(id => deleteData(id)));
            window.location.reload();
        }
        else{alert('Не выбран питомец')}
      };
    return(
        <div className={style.container}>
        {overlay? <AddDog params={userId}/> : <></>}
        <div className={style.menu_btn}>
            <div>
                <button className={style.add} onClick={handleAdd}>Добавить питомца</button>

            </div>
        
            <div>
                <button className={style.join} onClick={()=>{}}>Подать завку на участие</button>
                <button className={style.delete} onClick={()=>handleDelete(checkedItems)}>Удалить</button>
            </div>
            
        </div>
            {dogs.length ? dogs.map(dog=><><Checkbox index={dog.id} onChange={handleCheckBoxChange} /><Dog dog={dog} /></>) : <div style={{width: '100%', textAlign: 'center', fontSize: '20px', color: '#B4A59F'}}>У вас не добавлен ни один питомец</div>}
            {checkedItems}
        </div>
    )
}