import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Video from "./components/Video";
import { useState } from "react";
const App = () =>{
  const ButtonStyle={
    position: 'absolute',
    top: '8px',
    right: '8px',
    border: 'none'
  }
  const ButtonStyle2={
    position: 'absolute',
    top: '25px',
    right: '8px',
    border: 'none'
  }
  const [overlay, getOverlay] = useState(false)
  const [overlay2, getOverlay2] = useState(false)
  const handleClick =()=>{
    getOverlay(!overlay)
    getOverlay2(false)
  }
  const handleClick2 =()=>{
    getOverlay(false)
    getOverlay2(!overlay2)
  }
  return (
    <div className="App">
      <Video />
      <button style={ButtonStyle} onClick={handleClick}>Войти</button>
      {overlay ? <SignIn /> : <></>}
      <button style={ButtonStyle2} onClick={handleClick2}>Зарегистрироваться</button>
      {overlay2 ? <SignUp /> : <></>}

    </div>
  );
}

export default App;
