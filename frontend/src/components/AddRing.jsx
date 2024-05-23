import React, {useState, useEffect} from 'react'
import { useForm } from 'react-hook-form';
import MultiSelectCheckbox from './MultiSelectCheckbox';
import axios from 'axios';

const ContainerStyle ={
    margin: '0',
    padding: '0',
    top: '0',
    left: '0',
    zIndex:'1',
    position: 'fixed',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgb(0, 0, 0, 0.3)'
  }
  
  const FormStyle ={
    width: '429px',
    minHeight: '685px',
    backgroundColor: '#F8EDEB',
    border: '2px solid rgb(255, 181, 167)',
    marginTop: '0'
  }


const AddRing = () => {
    const {register, handleSubmit } = useForm();
    const [breeds, setBreed] = useState([''])
    const [selectedBreeds, setSelectedBreeds] = useState([]);
    useEffect(()=>{
      const fetchData = async () => {
          try {
              const data = await axios.get(`http://localhost:8082/breeds`);
              setBreed(data.data);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
      fetchData()
  }, []);
  const handleReload =()=>{
    window.location.reload()
  }

  const handleBreedsChange = (selected) => {
    setSelectedBreeds(selected || []);
  };

  const onSubmit = async (data) => {
    const selectedIds = selectedBreeds.map(breed => breed.value);

    const formData = {
        name: data.name,
        address: data.address,
        breed_id: selectedIds
    };
    console.log(formData)
    try {
        const response = await axios.post('http://localhost:8082/admin/create_ring', formData);
        console.log('Server response:', response.data);
        window.location.reload();
      } catch (error) {
        console.error('Error sending form data:', error);
      }
    console.log(formData.selectedIds)
    };
  return (
    <div style ={ContainerStyle}>
        <form  style={FormStyle} onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Введите название ринга" {...register("name", {required: true, maxLength: 30})} />
        <input type='text' placeholder='Введите адрес' {...register("address", {required: true})} />
        <MultiSelectCheckbox options={breeds} onChange={handleBreedsChange} placeholder={'Специализация...'} noOption={'Порода не найдена'}/>
        <button type="submit">Добавить</button>
        <button onClick={handleReload}>Отменить</button>
        </form>
    </div>
  )
}

export default AddRing