import React, {useState, useEffect} from 'react'
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import axios from 'axios';

const ContainerStyle ={
  margin: '0',
  padding: '0',
  top: '0',
  left: '0',
  zIndex: '10',
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

const EditDog = ({params}) => {
    const dog = params
    const {register, handleSubmit } = useForm();
    const [selectedOption, setSelectedOption] = useState(dog.breed_id);
    const [breeds, setBreed] = useState([''])
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

    const onSubmit = async(data) => {
      const new_data = {
        id: dog.id,
        images: images,
        name: data.name || dog.name,
        age: data.age || dog.age,
        vaccination: data.vaccination || dog.vaccination,
        breed_id: selectedOption ? selectedOption.value : dog.breed_id,
        gold_count: data.gold_count || dog.gold_count,
        silver_count: data.silver_count || dog.silver_count,
        bronze_count: data.bronze_count || dog.bronze_count
      }
        try{
            await axios.put('http://localhost:8082/edit_dog', new_data)           
            window.location.reload();
        }
        catch (error){
            console.error('Error:', error);
        };
    }
  const handleSelectChange = (selected) => {
    setSelectedOption(selected);
  };

  const [images, setImages] = useState(dog.images || []);
  const [error, setError] = useState('');
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const totalImages = images.length + files.length;
    if (totalImages > 5) {
      setError('Вы не можете загрузить больше 5 изображений, картинки не будут загружены.');
      return;
    } else {
      setError('');
    }
    const fileReaders = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders)
      .then((base64Images) => {
        setImages((prevImages) => [...prevImages, ...base64Images]);
      })
      .catch((error) => {
        console.error('Error converting images to Base64', error);
      });
  };
  const handleImageRemove = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const handleReload =()=>{
    window.location.reload()
  }
  return (
    <div style ={ContainerStyle}>
        <form  style={FormStyle} onSubmit={handleSubmit(onSubmit)}>
        <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '-20px' }}>{error}</p>}
      <div>
        {images.map((image, index) => (
          <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
          <img src={image} alt={`Upload ${index}`} style={{ width: '50px', height: '100%' }} />
          <button
            onClick={() => handleImageRemove(index)}
            style={{
              position: 'absolute',
              width: '18px',
              height: '15px',
              top: '-20px',
              right: '1px',
              backgroundColor: 'transparent',
              color: 'red',
              border: 'none',
              textAlign: 'center',
              alignItems: 'center',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            &times;
          </button>
        </div>
        ))}
      </div>
        <input type="text" placeholder={`${dog.name}`} {...register("name", {maxLength: 20})} />
        <input type='number' placeholder={`${dog.age}`} {...register("age")} />
      <Select
        styles={customStyles}
        value={selectedOption}
        onChange={handleSelectChange}
        options={breeds}
        placeholder="Измените породу"
        isSearchable={true}
        noOptionsMessage={() => "Порода не найдена"}
      />
        <label style={{textAlign: 'left', color: 'rgb(98, 90, 87)', marginTop: '30px', fontSize: '18px'}}>Дата последней вакцинации:</label>
        <input style ={{marginTop: '10px',}} type="date" placeholder={`${dog.vaccination}`} {...register("vaccination")} />
        <div style={{display: 'flex', justifyContent: 'space-between' , width: '90%'}}>
        <label style={{textAlign: 'left', color: 'rgb(98, 90, 87)', marginTop: '5px', fontSize: '18px'}}>Количество золотых наград:</label>
        <input style={{width: '70px', marginBottom: '10px'}} type='number' placeholder={`${dog.gold_count}`} {...register("gold_count")} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between' , width: '90%'}}>
        <label style={{textAlign: 'left', color: 'rgb(98, 90, 87)', marginTop: '5px', fontSize: '18px'}}>Количество серебряных наград:</label>
        <input style={{width: '70px', marginBottom: '10px'}} type='number' placeholder={`${dog.silver_count}`} {...register("silver_count")} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between' , width: '90%'}}>
        <label style={{textAlign: 'left', color: 'rgb(98, 90, 87)', marginTop: '5px', fontSize: '18px'}}>Количество бронзовых наград:</label>
        <input style={{width: '70px', marginBottom: '10px'}} type='number' placeholder={`${dog.bronze_count}`} {...register("bronze_count")} />
        </div>
        <button type="submit">Изменить</button>
        <button onClick={handleReload}>Отменить</button>
        </form>
        
    </div>
  )
}

export default EditDog