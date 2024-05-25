import React, { useEffect, useRef, useState } from 'react'
import style from './ExpertProfilePage.module.css'
import HeaderExpert from '../../components/HeaderExpert'
import { jwtDecode } from 'jwt-decode'
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import Checkbox from '../../components/Checkbox';
import Select from 'react-select';
const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '300px',
      height: '31px',
      border: 'none',
      borderRadius: '3px',
      background: 'transparent',
      boxShadow: 'none',
      color: 'rgb(98, 90, 87)',
      textAlign: 'left',
      fontSize: '18px',
      fontWeight: '400',
      '&:hover': {
        border: '1px solid rgba(84, 75, 73, 0.5)',
      },
      '&::placeholder': {
        color: 'rgb(180, 165, 159)',
      }
    }),
    option: (provided, state) => ({
      ...provided,
      margin: '0px',
      padding: '10px',
      backgroundColor: state.isSelected ? 'rgb(248, 237, 235)' : state.isFocused ? '#FFB5A7' : 'rgb(248, 237, 235)',
      color: state.isSelected ? 'rgb(98, 90, 87)' : 'rgb(98, 90, 87)',
      '&:hover': {
        backgroundColor: state.isSelected ? '#FFB5A7' : '#FFB5A7',
      },
    }),
    input: (provided) => ({
      ...provided,
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: 0,
    }),
  };
const ExpertProfilePage = () => {
  const navigate=useNavigate();
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
            <Profile />
        </main>
    </div>
  )
}

export default ExpertProfilePage

const Profile =() =>{
    const fileInputRef = useRef(null)
    const [id, setId] = useState('')
    const [name, setName] = useState('');
    const [surname, setSurname] =useState('');
    const [patronymic, setPatronymic] = useState('');
    const [image, setImage] = useState('')
    const [email, setEmail] = useState('')
    const [passport, setPassport] = useState('')
    const [applications, setApplication] = useState([])
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
    const fetchData = async() =>{
        try{
            const data = await axios.get(`http://localhost:8082/expert/applications?id=${id}`)
            setApplication(data.data);
        }catch(error){
            console.log(error)
        }
    }
    fetchData()

    }, [id])
  
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
      const new_specialization={
        specialization: selectedOption.value
      }
      try{
       const response = await axios.put(`http://localhost:8082/update_user?id=${id}`, new_data)
       await axios.put(`http://localhost:8082/expert/update_specialization?id=${id}`, new_specialization)
       const newToken = response.data.token;
       localStorage.setItem('token', newToken);
       alert('Ваши данные успешно обновлены.');
      }catch(error){
        console.log(error)
      }
    }
    const [selectedOption, setSelectedOption] = useState('');
    const [specialization, setSpecial] = useState('')
    const [breeds, setBreed] = useState([''])
    useEffect(()=>{
      const fetchData = async () => {
          try {
              const data = await axios.get(`http://localhost:8082/breeds`);
              const specialization = await axios.get(`http://localhost:8082/expert/info?id=${id}`)
              setBreed(data.data);
              setSpecial(specialization.data[0].breed)
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
      fetchData()
  }, [id]);
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
            await axios.delete(`http://localhost:8082/expert/delete_application?id=${id}` )
        }catch(error){
            console.log(error)
        }
    }
    if (checkedItems.length !== 0){
        await Promise.all(checkedItems.map(id => deleteData(id)));
        window.location.reload();
    }

    else{alert('Не выбран участник')}

  }
  const handleSelectChange = (selected) => {
    setSelectedOption(selected);
  };
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
      <Select
        styles={customStyles}
        value={selectedOption}
        onChange={handleSelectChange}
        options={breeds}
        placeholder={specialization===null ? "Выберите специализацию" : `${specialization}`}
        isSearchable={true}
        noOptionsMessage={() => "Порода не найдена"}
      />
    <div style={{width: '100%', height: 'max-content', display:'flex'}}>
      <button className={style.btn}  onClick={handleSave}>Сохранить данные</button>
    </div>
      </div>
      </div>
      <div className={style.application}>
        <div className={style.title}>Ваши заявки</div>

        {applications.length !== 0 ? applications.map(el =><tr key={el.id}>
           <td> <Checkbox key={el.id}
            index={el.id}
            onChange={handleCheckBoxChange}/></td>
            <td>{el.ring}</td>
           -- {el.status === 'Одобрено'? <td style={{color: 'green'}}>{el.status}</td> : el.status === 'Отклонено'? <td style={{color: 'red'}}>{el.status}</td> : <td>{el.status}</td>}
        </tr>): <></>}
        <div style={{display:'flex', justifyContent:'right'}}>
                <button className={style.delete} onClick={() => handleDelete(checkedItems)}>Удалить заявки</button>
        </div>
      </div>
    </div>
    )
  }