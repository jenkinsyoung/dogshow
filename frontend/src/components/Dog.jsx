import React, { useState } from 'react'
import style from './Dog.module.css'
import EditDog from './EditDog'
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
          dog.images.map((image, index) => (
            <div key={index} style={{backgroundImage: `url(${image})`}} className={style.img}/>
          ))
        ) : (
          <p>No images available</p>
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
                    <span>{dog.club_id}</span>
                </div>
            </div>
            <div className={style.rewards}>
            <p className={style.title}>Награды</p>
                <div className={style.criterion}>
                🥇:
                    <span>{dog.age}</span>
                </div>
                <div className={style.criterion}>
                🥈:
                    <span>{dog.breed}</span>
                </div>
                <div className={style.criterion}>
                🥉:
                    <span>{dog.vaccination.split('T')[0]}</span>
                </div>
            </div>
            <div className={style.ring}>
            <p className={style.title}>О текущем участии</p>
                <div className={style.criterion}>
                    Ринг:
                    <span>{dog.age}</span>
                </div>
            </div>
        <div className={style.marks}>
        <p className={style.title}>Оценки</p>
            <div className={style.criterion}>
                Стойка:
                <span>{dog.age}</span>
            </div>
            <div className={style.criterion}>
                Здоровье:
                <span>{dog.age}</span>
            </div>
            <div className={style.criterion}>
                Движение:
                <span>{dog.age}</span>
            </div>
            <div className={style.criterion}>
                Соответствие породе:
                <span>{dog.age}</span>
            </div>
            <div className={style.criterion}>
                Внешний вид:
                <span>{dog.age}</span>
            </div>
        </div>
        </div>
    </div>
    </>
  )
}

export default Dog