import React from 'react'
import styles from './Podium.module.css'
const Podium =()=> {
  return (
    <div className={styles.container}>
        <h2 className={styles.ring}>Название ринга</h2>
        <div className={styles.places}>
            <div className={styles.second_place}>
                <div className={`${styles.participant} && ${styles.two}`}>
                    <div className={styles.photo} />
                    <div className={styles.nickname}>Кличка собаки</div>
                </div>
                <div className={styles.second_pedestal}>
                    <div className={styles.number_place}>2</div>
                </div>
            </div>
            <div className={styles.first_place}>
                <div className={`${styles.participant} && ${styles.one}`}>
                    <div className={styles.photo} />
                    <div className={styles.nickname}>Кличка собаки</div>
                </div>
                <div className={styles.first_pedestal}>
                    <div className={styles.number_place}>1</div>
                </div>
            </div>
            <div className={styles.third_place}>
                <div className={`${styles.participant} && ${styles.three}`}>
                    <div className={styles.photo} />
                    <div className={styles.nickname}>Кличка собаки</div>
                </div>
                <div className={styles.third_pedestal}>
                    <div className={styles.number_place}>3</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Podium