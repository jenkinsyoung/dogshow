import React, {useState, useEffect} from 'react'
import { useForm } from 'react-hook-form';
import Select from 'react-select';
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
const JoinUser = ({params}) => {
    const dogId = params
    const {handleSubmit } = useForm();
    const [selectedOption, setSelectedOption] = useState('');
    const [rings, setRings] = useState([''])
    useEffect(()=>{
      const fetchData = async () => {
          try {
              const data = await axios.get(`http://localhost:8082/rings`);
              setRings(data.data);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
      fetchData()
  }, []);

    const onSubmit = async(data) => {
      const new_data = {
        dog_id: dogId,
        ring_id: selectedOption.value
      }
        try{
            await axios.post('http://localhost:8082/new_application', new_data)           
            window.location.reload();
        }
        catch (error){
            console.error('Error searching:', error);
        };
    }
  const handleSelectChange = (selected) => {
    setSelectedOption(selected);
  };

  const handleReload =()=>{
    window.location.reload()
  }
  return (
    <div style ={ContainerStyle}>
        <form  style={FormStyle} onSubmit={handleSubmit(onSubmit)}>
      <Select
        styles={customStyles}
        value={selectedOption}
        onChange={handleSelectChange}
        options={rings}
        placeholder="Выберите ринг"
        isSearchable={true}
        noOptionsMessage={() => "Ринг не найден"}
      />
        <button type="submit">Подать заявку</button>
        <button onClick={handleReload}>Отменить</button>
        </form>
    </div>
  )
}

export default JoinUser