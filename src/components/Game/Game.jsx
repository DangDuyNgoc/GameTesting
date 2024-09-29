import { useEffect, useState } from "react";
import "./Game.css";

const Game = () => {
  const [inputValue, setInputValue] = useState(3);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const [marks, setMarks] = useState([]);
  const [start, setStart] = useState(false);
  const [over, setOver] = useState("");
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    if (start && !over) {
      let markArr = [];
      const numMarks = parseInt(inputValue, 10) || 3;
      for (let i = 1; i <= numMarks; i++) {
        markArr.push({
          id: i,
          x: Math.random() * 90,
          y: Math.random() * 90,
          visible: true,
          clicked: false,
        });
      }

      markArr.sort((a, b) => b.id - a.id);

      setMarks(markArr);
      setNextId(1);
      setOver("");

      const id = setInterval(() => setTime((prev) => prev + 0.1), 100);
      setTimer(id);
      return () => clearInterval(id);
    }
  }, [start, inputValue, over]);

  useEffect(() => {
    if (
      marks.length > 0 &&
      marks.every((mark) => !mark.visible) &&
      start &&
      !over
    ) {
      setOver("allCleared");
    }
  }, [marks, start, over]);

  useEffect(() => {
    if (over && timer) {
      clearInterval(timer);
    }
  }, [over, timer]);

  const handleClick = (id) => {
    if (id === nextId) {
      setMarks((prevMark) =>
        prevMark.map((item) =>
          item.id === id ? { ...item, clicked: true } : item
        )
      );

      setTimeout(() => {
        setMarks((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, visible: false, clicked: false } : item
          )
        );
      }, 3000);

      setNextId((prev) => prev + 1);
    } else {
      setOver("gameOver");
    }
  };

  const handleStartGame = () => {
    setTime(0);
    setOver("");
    setStart(true);
  };

  const handleRestart = () => {
    setTime(0);
    setOver("");
    setMarks((prevMark) =>
      prevMark.map((mark) => ({ ...mark, visible: true, clicked: false }))
    );
    setStart(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInput = (e) => {
    if (e.keyCode === 13) {
      handleStartGame();
    }
  };

  return (
    <div>
      <h1>LETS PLAY</h1>
      {over === "allCleared" && <h2 className="all-cleared">ALL CLEARED</h2>}
      {over === "gameOver" && <h2 className="game-over">GAME OVER</h2>}
      <div>
        <div className="game-header mb-6">
          Points:
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInput}
            min="1"
          />
        </div>
        <div className="mb-6">Time: {time.toFixed(1)}s</div>
        {!start ? (
          <button className="mb-6" onClick={handleStartGame}>
            Play
          </button>
        ) : (
          <button className="mb-6" onClick={handleRestart}>
            Restart
          </button>
        )}
      </div>

      <div className="container">
        {marks.map((mark) => {
          if (mark.visible) {
            return (
              <div
                key={mark.id}
                onClick={() => handleClick(mark.id)}
                className={`game ${mark.clicked ? "clicked" : ""}`}
                style={{ top: `${mark.y}%`, left: `${mark.x}%` }}
              >
                {mark.id}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Game;
