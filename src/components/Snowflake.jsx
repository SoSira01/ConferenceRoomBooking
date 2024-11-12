import React, { useEffect, useState } from 'react';

const SnowflakeIcon = () => {
  const variants = ['❄', '❅', '❆', '•'];
  return variants[Math.floor(Math.random() * variants.length)];
};

const Snowflake = ({ style }) => {
  const size = Math.random() * 1 + 0.5; // Random size between 0.5 and 1.5em
  const animationDuration = Math.random() * 20 + 10; // Random duration between 10-30s
  const startPosition = Math.random() * 100; // Random start position

  return (
    <div
      style={{
        ...style,
        position: 'fixed',
        color: 'white',
        userSelect: 'none',
        zIndex: 1,
        top: '-20px',
        left: `${startPosition}vw`,
        fontSize: `${size}em`,
        filter: 'blur(0.5px)',
        opacity: Math.random() * 0.6 + 0.4, // Random opacity between 0.4-1
        animation: `fall ${animationDuration}s linear infinite`,
        textShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
      }}
    >
      <SnowflakeIcon />
    </div>
  );
};

const SnowfallEffect = ({ count = 50 }) => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    // Generate initial snowflakes with staggered start times
    const initialSnowflakes = Array.from({ length: count }, (_, i) => ({
      id: i,
      style: {
        animationDelay: `${Math.random() * 30}s` // Random delay up to 30s
      }
    }));
    setSnowflakes(initialSnowflakes);

    // Add style to handle the animation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes fall {
        0% {
          transform: translateY(0) rotate(0deg) translateX(0);
        }
        25% {
          transform: translateY(25vh) rotate(90deg) translateX(15px);
        }
        50% {
          transform: translateY(50vh) rotate(180deg) translateX(-15px);
        }
        75% {
          transform: translateY(75vh) rotate(270deg) translateX(15px);
        }
        100% {
          transform: translateY(105vh) rotate(360deg) translateX(0);
        }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [count]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'hidden'
      }}
    >
      {snowflakes.map(({ id, style }) => (
        <Snowflake key={id} style={style} />
      ))}
    </div>
  );
};

export default SnowfallEffect;