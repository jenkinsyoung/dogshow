import React, { useState, useEffect } from 'react';

function Countdown() {
  const calculateTimeLeft = () => {
    const difference = +new Date("2024-06-15") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        дней: Math.floor(difference / (1000 * 60 * 60 * 24)),
        часов: Math.floor((difference / (1000 * 60 * 60)) % 24),
        минут: Math.floor((difference / 1000 / 60) % 60),
        секунд: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach(interval => {

    timerComponents.push(
      <div key={interval}>
        {interval === 'секунд' ? <> {timeLeft[interval]}</>:<>{timeLeft[interval]}{":"}</> }
      </div>
    );
  });

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      {timerComponents.length ? timerComponents : <span>0:0:0:0</span>}
    </div>
  );
}

export default Countdown;