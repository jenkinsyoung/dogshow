import React, { useState } from 'react'
import style from './Dog.module.css'
import EditDog from './EditDog'
import DogSwiper from './DogSwiper'
const Dog = ({dog}) => {
    const [overlay, setOverlay] = useState(false)
    const handleClick =()=>{
        setOverlay(!overlay)
    }
  return (
    <>
    {overlay? <EditDog params = {dog} /> : <></>}
    <div className={style.container}>
        {dog.images && dog.images.length > 0 && dog.images[0] ? (
        <DogSwiper photo={dog.images} />
        ) : (
          <p style={{padding:'5px', fontSize: '18px'}}>Не загружены фотографии</p>
        )}
        <div className={style.info_dog}>
        <div className={style.nickname}>
            <div/>
            <div>{dog.name}</div>
            <button className={style.edit} onClick={handleClick}>Редактировать</button>
        </div>
        
            <div className={style.main_info}>
                <p className={style.title}>Информация</p>
                <div className={style.criterion}>
                    возраст:
                    <span>{dog.age}</span>
                </div>
                <div className={style.criterion}>
                    порода:
                    <span>{dog.breed}</span>
                </div>
                <div className={style.criterion}>
                    дата вакцинации:
                    <span>{dog.vaccination.split('T')[0]}</span>
                </div>
                <div className={style.criterion}>
                    клуб:
                    <span>{dog.club}</span>
                </div>
            </div>
            <div className={style.rewards}>
            <p className={style.title}>Награды</p>
                <div className={style.criterion}>
                🥇:
                    <span>{dog.gold_count}</span>
                </div>
                <div className={style.criterion}>
                🥈:
                    <span>{dog.silver_count}</span>
                </div>
                <div className={style.criterion}>
                🥉:
                    <span>{dog.bronze_count}</span>
                </div>
            </div>
            <div className={style.ring}>
            <p className={style.title}>О текущем участии</p>
                <div className={style.criterion}>
                    Ринг:
                    {dog.rings.map(ring=><span>{ring}</span>)}
                </div>
            </div>
        <div className={style.marks}>
        {dog.marks.length > 0 ? <p className={style.title}>Оценки</p>: <></>}
        {dog.marks.map((el, index) => <div key={index} className={style.criterion}>
                {el.criteria}:
                <span>{el.value}</span>
            </div>)}
        </div>
        </div>
    </div>
    </>
  )
}

export default Dog