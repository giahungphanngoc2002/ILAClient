import React, { useState, useEffect } from "react";

const CountdownCircle = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  

  return (
    <div className="countdown-circle">
      <svg width={120} height={120}>
        <circle
          cx={60}
          cy={60}
          r={radius}
          stroke="#e6e6e6"
          strokeWidth={10}
          fill="none"
        />
        <circle
          cx={60}
          cy={60}
          r={radius}
          stroke="#00aaff"
          strokeWidth={10}
          fill="none"
          strokeDasharray={circumference}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="20px"
          fill="#000"
        >
          {duration}
        </text>
      </svg>
    </div>
  );
};

export default CountdownCircle;
