import React, { Component } from "react";

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

class RSP extends Component {
  state = {
    imgCoord: rspCoords.scissors,
    result: "",
    score: 0,
    clickable: true,
  };

  interval;

  componentDidMount() {
    // 컴포넌트가 첫 렌더링된 후, 여기에 비동기 요청을 많이 함
    this.interval = setInterval(this.changeHand, 100);
  }

  componentWillUnmount() {
    // 컴포넌트가 제거되기 직전, 비동기 요청 정리를 많이 함
    clearInterval(this.interval);
  }

  onClickBtn = (choice) => () => {
    const { imgCoord, clickable } = this.state;
    if (clickable) {
      clearInterval(this.interval);
      this.setState({
        clickable: false,
      });
      const myScore = scores[choice];
      const cpuScore = scores[computerChoice(imgCoord)];
      const diff = myScore - cpuScore;
      if (diff === 0) {
        this.setState({
          result: "비겼습니다!",
        });
      } else if ([-1, 2].includes(diff)) {
        this.setState((prev) => {
          return { result: "이겼습니다!", score: prev.score + 1 };
        });
      } else {
        this.setState((prev) => {
          return { result: "졌습니다!", score: prev.score - 1 };
        });
      }
      setTimeout(() => {
        this.setState({
          clickable: true,
        });
        this.interval = setInterval(this.changeHand, 100);
      }, 2000);
    }
  };

  changeHand = () => {
    const { imgCoord } = this.state;
    if (imgCoord === rspCoords.scissors) {
      this.setState({
        imgCoord: rspCoords.rock,
      });
    } else if (imgCoord === rspCoords.rock) {
      this.setState({
        imgCoord: rspCoords.paper,
      });
    } else if (imgCoord === rspCoords.paper) {
      this.setState({
        imgCoord: rspCoords.scissors,
      });
    }
  };

  render() {
    const { result, score, imgCoord } = this.state;
    return (
      <>
        <div
          id="computer"
          style={{
            background: `url(./rsp.png) ${imgCoord} 0 / auto 200px`,
          }}
        ></div>
        <div>
          <button
            id="scissors"
            className="btn"
            onClick={this.onClickBtn("scissors")}
          >
            가위
          </button>
          <button id="rock" className="btn" onClick={this.onClickBtn("rock")}>
            바위
          </button>
          <button id="paper" className="btn" onClick={this.onClickBtn("paper")}>
            보
          </button>
        </div>
        <div>{result}</div>
        <div>현재 {score}점</div>
      </>
    );
  }
}

export default RSP;
