import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Select from 'react-select';
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
  
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '350px',
      height: '31px',
      border: 'none',
      borderBottom: '2px solid rgb(255, 181, 167)',
      borderRadius: '3px',
      background: 'rgb(248, 237, 235)',
      boxShadow: 'none',
      color: 'rgb(98, 90, 87)',
      textAlign: 'center',
      fontSize: '18px',
      fontWeight: '400',
      '&:hover': {
        border: '2px solid rgb(255, 181, 167)',
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

const AddExpert = () => {
    const {handleSubmit } = useForm();
    const [experts, setExperts] = useState([]);
    const [rings, setRings] = useState([]);
    const [selectedOptionRing, setSelectedOptionRing] = useState('');
    const [selectedOptionExpert, setSelectedOptionExpert] = useState('');
    useEffect(()=>{
        const fetchDataDog = async () => {
            try {
                const data = await axios.get(`http://localhost:8082/admin/experts_app`);
                setExperts(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchDataDog()
    }, [])
    useEffect(()=>{
        const fetchDataRing = async () => {
            try {
                const data = await axios.get(`http://localhost:8082/admin/user_rings`);
                setRings(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchDataRing();
    }, [])
    const handleSelectChangeRing = (selected) => {
        setSelectedOptionRing(selected);
      };
    const handleSelectChangeDog = (selected) => {
    setSelectedOptionExpert(selected);
    };
      const handleReload =()=>{
        window.location.reload()
      }
      const onSubmit = async(data) => {
        const new_data = {
          expert_id: selectedOptionExpert.value,
          ring_id: selectedOptionRing.value,
          status: 'Одобрено'
        }
          try{
              await axios.post('http://localhost:8082/admin/add_expert', new_data)           
              window.location.reload();
          }
          catch (error){
              console.error('Error searching:', error);
          };
      }
  return (
    <div style ={ContainerStyle}>
        <form  style={FormStyle} onSubmit={handleSubmit(onSubmit)}>
        <Select
        styles={customStyles}
        value={selectedOptionExpert}
        onChange={handleSelectChangeDog}
        options={experts}
        placeholder="Выберите эксперта"
        isSearchable={true}
        noOptionsMessage={() => "Эксперт не найден"}
      />
      <Select
        styles={customStyles}
        value={selectedOptionRing}
        onChange={handleSelectChangeRing}
        options={rings}
        placeholder="Выберите ринг"
        isSearchable={true}
        noOptionsMessage={() => "Ринг не найден"}
      />
        <button type="submit">Добавить</button>
        <button onClick={handleReload}>Отменить</button>
        </form>
    </div>
  )
}

export default AddExpert