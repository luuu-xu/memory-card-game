import './App.css';
import DIGIMONS from './DIGIMONS';
import LEVELS from './LEVELS';
import { useEffect, useState } from 'react';

function App() {
  return (
    <div className="App">
      <h1 className="header">Digimon Memory Card Game</h1>
      <MemoryCardGame />
    </div>
  );
};

function MemoryCardGame() {
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const incrementCurrentScore = () => {
    setCurrentScore(currentScore + 1);
  };

  useEffect(() => {
    if (currentScore > bestScore) {
      setBestScore(currentScore);
    };
  }, [currentScore, bestScore]);

  const resetCurrentScore = () => {
    setCurrentScore(0);
  };

  return (
    <div className="memory-card-game">
      <Scoreboard
        currentScore={currentScore}
        bestScore={bestScore}
      />
      <Game
        incrementCurrentScore={incrementCurrentScore}
        resetCurrentScore={resetCurrentScore}
      />
    </div>
  );
};

function Scoreboard({ currentScore, bestScore }) {
  return (
    <div className="scoreboard">
      <div>Current Score: {currentScore}</div>
      <div>Best Score: {bestScore}</div>
    </div>
  );
};

function Game({ incrementCurrentScore, resetCurrentScore }) {
  const [level, setLevel] = useState(1);
  const [levelDigimons, setLevelDigimons] = useState([]);
  const [picked, setPicked] = useState([]);

  const pickDigimons = (level) => {
    const number = LEVELS[level - 1];
    return randomPickSomeFromArray(number, DIGIMONS);
  };

  const handleClickNextLevel = () => {
    setLevel(level + 1);
  };

  const handleClickReset = () => {
    setLevel(1);
    setPicked([]);
    setLevelDigimons(pickDigimons(level));
    resetCurrentScore();
  };

  const handleClickCard = (e) => {
    const digimonName = e.target.className.split(' ')[1];
    if (picked.includes(digimonName)) {
      console.log('inside picked! fail!');
      handleClickReset();
    } else {
      console.log('not inside, continue');
      setPicked([...picked, digimonName]);
      incrementCurrentScore();
    };
  };

  // componentDidUpdate on level
  useEffect(() => {
    setPicked([]);
    setLevelDigimons(pickDigimons(level));
  }, [level]);

  // componentDidUpdate on picked
  useEffect(() => {
    if (picked.length === LEVELS[level - 1]) {
      console.log('won! next level!');
      // setLevel(level + 1);
      handleClickNextLevel();
    };
  }, [picked]);

  return (
    <div className="game">
      <LevelHeader level={level} />
      <Gameboard digimons={levelDigimons} onClickCard={handleClickCard} />
      <button onClick={handleClickNextLevel}>Next Level</button>
      <button onClick={handleClickReset}>Reset</button>
    </div>
  );
};

function LevelHeader({ level }) {
  return (
    <h3 className="level-header">
      Level: {level}
    </h3>
  );
};

function Gameboard({ digimons, onClickCard }) {
  useEffect(() => {
    digimons = durstenfeldShuffle(digimons);
  });

  return (
    <ul className="gameboard">
      {digimons.map((digimon) => {
        return (
          <Card
            digimon={digimon}
            key={digimon.name}
            onClickCard={onClickCard}
          />
        );
      })}
    </ul>
  );
};

function Card({ digimon, onClickCard }) {
  const addDigimonNameToClassName = (className) => {
    return [className, digimon.name].join(' ');
  };

  return (
    <div className={addDigimonNameToClassName('card-div')} onClick={onClickCard}>
      <img
        className={addDigimonNameToClassName('card-img')}
        src={digimon.url}
        alt={digimon.name}
      />
      <p className={addDigimonNameToClassName('card-name')}>{digimon.name}</p>
    </div>
  );
};

const durstenfeldShuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  };
  return array;
};

const randomPickSomeFromArray = (number, array) => {
  const shuffledArray = durstenfeldShuffle(array);
  return shuffledArray.slice(0, number);
};

export default App;
