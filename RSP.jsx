import React, { useState, useRef, useEffect } from "react";

//클래스의 경우 -> constructor -> render -> ref -> componentDidMount
// (setState/props 변경시) -> shouldComponentUpdate(true) -> render -> componentDidUpdate
//부모가 자식컴포넌트를 없앨 때 -> componentWillUnmount -> 소멸

const rspCoords = {
  scissors: "0",
  rock: "-220px",
  paper: "-427px",
};

const scores = {
  scissors: 1,
  rock: 0,
  paper: -1,
};

const computerChoice = (imgCoord) => {
  return Object.entries(rspCoords).find(function (v) {
    return v[1] === imgCoord;
  })[0];
};

const RSP = () => {
  const [imgCoord, setImgCoord] = useState(rspCoords.scissors);
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [clickable, setClickable] = useState(true);
  const interval = useRef();

  useEffect(() => {
    // class component라이프 사이클 대체함
    interval.current = setInterval(changeHand, 100); // componentDidMount, componentDidUpdate역할
    return () => {
      // componentWillUnmount 역할
      clearInterval(interval.current);
    };
  }, [
    imgCoord, //배열 안에 참조하고 있는 요소가 바뀔 때 마다 useEffect안에 콜백함수가 실행됨
  ]);

  const changeHand = () => {
    if (imgCoord === rspCoords.scissors) {
      setImgCoord(rspCoords.rock);
    } else if (imgCoord === rspCoords.rock) {
      setImgCoord(rspCoords.paper);
    } else if (imgCoord === rspCoords.paper) {
      setImgCoord(rspCoords.scissors);
    }
  };

  const onClickBtn = (choice) => () => {
    if (clickable) {
      clearInterval(interval.current);
      setClickable(false);
      const myScore = scores[choice];
      const cpuScore = scores[computerChoice(imgCoord)];
      const diff = myScore - cpuScore;
      if (diff === 0) {
        setResult("비겼습니다!");
      } else if ([-1, 2].includes(diff)) {
        setResult("이겼습니다!");
        setScore((prev) => prev + 1);
      } else {
        setResult("졌습니다!");
        setScore((prev) => prev - 1);
      }
      setTimeout(() => {
        setClickable(true);
        interval.current = setInterval(changeHand, 100);
      }, 2000);
    }
  };

  return (
    <>
      <div
        id="computer"
        style={{
          background: `url(./rsp.png) ${imgCoord} 0 / auto 200px`,
        }}
      ></div>
      <div>
        <button id="scissors" className="btn" onClick={onClickBtn("scissors")}>
          가위
        </button>
        <button id="rock" className="btn" onClick={onClickBtn("rock")}>
          바위
        </button>
        <button id="paper" className="btn" onClick={onClickBtn("paper")}>
          보
        </button>
      </div>
      <div>{result}</div>
      <div>현재 {score}점</div>
    </>
  );
};

export default RSP;
