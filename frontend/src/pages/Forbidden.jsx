import React from 'react'
import { useNavigate } from 'react-router-dom'
const Background={
    margin: '0',
    padding: '0',
    width: '100%',
    height: '100vh',
    backgroundImage: 'url(/dog.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
}
const Forbidden = ()=> {
  const navigate = useNavigate()
  return (
    <div style={Background}>
        <h1 style={{fontSize: '10vh', margin: '0', padding: '20px'}}>403 FORBIDDEN</h1>
        <div style={{fontSize: '24px', margin: '0', padding: '20px'}}>У вас нет доступа к данной странице</div>
        <div style={{fontSize: '24px', margin: '0', padding: '20px', cursor:'pointer', textDecoration: 'underline'}} onClick={()=>navigate(-1)}>Назад</div>
    </div>
  )
}

export default Forbidden