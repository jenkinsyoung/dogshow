import React, { useEffect, useRef, useState } from 'react'
import style from './AdminProfilePage.module.css'
import HeaderAdmin from '../../components/HeaderAdmin'
import { jwtDecode } from 'jwt-decode'
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
const AdminProfilePage = () => {
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
            <Profile />
        </main>
    </div>
  )
}

export default AdminProfilePage

const Profile =() =>{
  const fileInputRef = useRef(null)
  const [id, setId] = useState('')
  const [name, setName] = useState('');
  const [surname, setSurname] =useState('');
  const [patronymic, setPatronymic] = useState('');
  const [image, setImage] = useState('')
  const [email, setEmail] = useState('')
  const [passport, setPassport] = useState('')
  useEffect(()=>{
    const token = localStorage.getItem('token');
  if(token){
    const decodedToken = jwtDecode(token);
    setId(decodedToken.userId)
    setName(decodedToken.name);
    setSurname(decodedToken.surname);
    setPatronymic(decodedToken.patronymic);
    setImage(decodedToken.image);
    setEmail(decodedToken.email);
    setPassport(decodedToken.passport)
  }
  }, [])

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const fileReaders = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    });

    return Promise.all(fileReaders);
  };

  const handleFileInput = () => {
    fileInputRef.current.click();
  };

  const handleChangeImage = async (event) => {
    try {
      const convertedImages = await handleImageUpload(event);
      setImage(convertedImages);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeEmail = (event)=>{
    setEmail(event.target.value)
  }

  const handleSave=async()=>{
    const new_data={
      name: name,
      surname: surname, 
      patronymic: patronymic,
      email: email,
      passport: passport,
      image: image[0].length > 1 ? image[0] : image
    }
    console.log(new_data)
    try{
     const response = await axios.put(`http://localhost:8082/update_user?id=${id}`, new_data)
     const newToken = response.data.token;
     localStorage.setItem('token', newToken);
     alert('Ваши данные успешно обновлены.');
    }catch(error){
      console.log(error)
    }
  }
  return(
    <div className={style.container}>
      <div style={{display: 'flex'}}>
      <div className={style.photo}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleChangeImage}
        />
        {image === "" || image === null ? (
          <div className={style.image} style={{backgroundImage: 'url(/photo.svg)'}} onClick={handleFileInput} />
        ) : (
          <div className={style.image} style={{backgroundImage: `url(${image})`}} onClick={handleFileInput} />
        )}
      </div>
    <div style={{marginLeft: '30px', marginTop: '30px'}}>
    <div>
    <div className={style.welcome}><input placeholder={`${surname}`} type='text' onChange={(e)=>setSurname(e.target.value)} required/></div>
    <div className={style.welcome}><input placeholder={`${name}`} type='text' onChange={(e)=>setName(e.target.value)} required/></div>
    <div className={style.welcome}><input placeholder={`${patronymic}`} type='text' onChange={(e)=>setPatronymic(e.target.value)} /></div>
    </div>
    <div className={style.email}>email: 
        <input placeholder={`${email}`} type='email' onChange={handleChangeEmail} />
    </div>
    <div className={style.passport}>Серия и номер паспорта: 
        <input placeholder={`${passport}`} type='text' onChange={(e)=>setPassport(e.target.value)} />
    </div>
  <div style={{width: '100%', height: 'max-content', display:'flex'}}>
    <button className={style.btn}  onClick={handleSave}>Сохранить данные</button>
  </div>
    </div>
    </div>
    </div>
  )
}