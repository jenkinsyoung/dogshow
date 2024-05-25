import React from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
const ContainerStyle ={
    margin: '0',
    padding: '0',
    top: '0',
    left: '0',
    position: 'fixed',
    zIndex: '1',
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
    height: '685px',
    backgroundColor: '#F8EDEB',
    border: '2px solid rgb(255, 181, 167)',
    marginTop: '0'
  }
  

const AddMark = ({dog_id, user_id}) => {
    const dogId = dog_id;
    const userId = user_id
    const {register, handleSubmit } = useForm();
      const handleReload =()=>{
        window.location.reload()
      }
      const onSubmit = async(data) => {
          try{
              await axios.post(`http://localhost:8082/expert/add_mark?dog_id=${dogId}&user_id=${userId}`, data)           
              window.location.reload();
          }
          catch (error){
              console.error('Error searching:', error);
          };
      }
  return (
    <div style ={ContainerStyle}>
        <form  style={FormStyle} onSubmit={handleSubmit(onSubmit)}>
        <div style={{display: 'flex', justifyContent: 'space-between' , width: '90%'}}>
        <label style={{textAlign: 'left', color: 'rgb(98, 90, 87)', marginTop: '5px', fontSize: '18px'}}>Внешний вид:</label>
        <input style={{width: '70px', marginBottom: '10px'}} type='number' required {...register("criterion1", {max: 5, min: 0})} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between' , width: '90%'}}>
        <label style={{textAlign: 'left', color: 'rgb(98, 90, 87)', marginTop: '5px', fontSize: '18px'}}>Стойка:</label>
        <input style={{width: '70px', marginBottom: '10px'}} type='number' required {...register("criterion2", {max: 5, min: 0})} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between' , width: '90%'}}>
        <label style={{textAlign: 'left', color: 'rgb(98, 90, 87)', marginTop: '5px', fontSize: '18px'}}>Движение:</label>
        <input style={{width: '70px', marginBottom: '10px'}} type='number' required {...register("criterion3", {max: 5, min: 0})} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between' , width: '90%'}}>
        <label style={{textAlign: 'left', color: 'rgb(98, 90, 87)', marginTop: '5px', fontSize: '18px'}}>Здоровье:</label>
        <input style={{width: '70px', marginBottom: '10px'}} type='number' required {...register("criterion4", {max: 5, min: 0})} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between' , width: '90%'}}>
        <label style={{textAlign: 'left', color: 'rgb(98, 90, 87)', marginTop: '5px', fontSize: '18px'}}>Соответствие породе:</label>
        <input style={{width: '70px', marginBottom: '10px'}} type='number' required {...register("criterion5", {max: 5, min: 0})} />
        </div>
        <button type="submit">Оценить</button>
        <button onClick={handleReload}>Отменить</button>
        </form>
    </div>
  )
}

export default AddMark