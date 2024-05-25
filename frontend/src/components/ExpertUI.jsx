import React from 'react'
import style from './ExpertUI.module.css'
const ExpertUI = ({expert}) => {
  return (
    <div className={style.card}>
        <div className={style.content}>
            <div className={style.photo} style={{backgroundImage: `url(${expert.image})`}}/>
            <div className={style.name}>{expert.fio}</div>
            <div className={style.specialization}>
                <p style={{paddingRight: '5px'}}>Специализация:</p>
                <span>{expert.breed}</span>
            </div>
            <div className={style.specialization}>
                <p style={{paddingRight: '5px'}}>email: </p>
                <span>{expert.email}</span>
            </div>
        </div>
    </div>
  )
}

export default ExpertUI