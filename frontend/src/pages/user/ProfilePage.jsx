import React, { useEffect, useState } from 'react'
import style from './Profile.module.css'
import HeaderUser from '../../components/HeaderUser'
import { jwtDecode } from 'jwt-decode'
// import { useNavigate} from 'react-router-dom';
const ProfilePage = () => {
  return (
    <div className='page'>
        <HeaderUser />

        <main>
            <Profile />
        </main>
    </div>
  )
}

export default ProfilePage

const Profile =() =>{

  const [name, setName] = useState('');
  const [surname, setSurname] =useState('');
  const [patronymic, setPatronymic] = useState('');

  useEffect(()=>{
    const token = localStorage.getItem('token');
  if(token){
    const decodedToken = jwtDecode(token);
    setName(decodedToken.name);
    setSurname(decodedToken.surname);
    setPatronymic(decodedToken.patronymic);

  }
  }, [])
  
  

  return(
    <>
    <div className={style.welcome}>{name} {surname} {patronymic}</div>
    </>
  )
}