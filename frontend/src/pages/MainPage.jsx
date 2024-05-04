import SignIn from "../components/SignIn";
import Video from "../components/Video";
import { useState } from "react";
const MainPage = () =>{
  const ButtonStyle={
    position: 'absolute',
    top: '8px',
    right: '8px',
    border: 'none'
  }
  
  const [overlay, getOverlay] = useState(false)

  const handleClick =()=>{
    getOverlay(!overlay)
  }

  return (
    <div>
      <Video />
      <button style={ButtonStyle} onClick={handleClick}>Войти</button>
      {overlay ? <SignIn /> : <></>}
    </div>
  );
}

export default MainPage;