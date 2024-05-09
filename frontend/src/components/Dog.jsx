import React from 'react'
import style from './Dog.module.css'
const Dog = ({dog}) => {
  return (
    <div className={style.container}>
        <div className="nickname">{dog.name}</div>
        <div className="main_info">
            <div className="criterion">
                возраст:
                <span>{dog.age}</span>
            </div>
            <div className="criterion">
                порода:
                <span>{dog.breed}</span>
            </div>
            <div className="criterion">
                дата вакцинации:
                <span>{dog.vaccination.split('T')[0]}</span>
            </div>
            <div className="criterion">
                клуб:
                <span>{dog.club_id}</span>
            </div>
        </div>
    </div>
  )
}

export default Dog