import React from 'react'
import main from '../assets/main.mp4'
import './Video.css'
const Video = () => {
  return (
    <div className='video'>
        <div className='overlay' />
        <video src={main} autoPlay loop muted/>
        <div className='content'>
            <img src='/logo.png' alt=''/>
            <h1>Присоединяйся к нашим выставкам, создавай свои клубы и становись экспертом</h1>
        </div>
    </div>
  )
}
export default Video