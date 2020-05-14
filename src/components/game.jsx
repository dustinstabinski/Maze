import React, { Component } from "react";
import Maze from "./maze";
import Timer from "./timer";

const TIME_TO_BEAT = 30;
const SIZE = 25;
const END = SIZE * SIZE - 1;

class Game extends Component {
  state = {
    inMotion: false,
    gameComplete: false,
    playerWon: false
  };

  sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  startMaze = () => {
    document.getElementById("create-maze").click();
    document.getElementById("timer").innerHTML = TIME_TO_BEAT;
    var timer = setInterval(() => {
      var time = parseInt(document.getElementById("timer").innerHTML);
      if (time <= 0) {
        document.getElementById("show-solution").click();
        this.setState({ inMotion: false, gameComplete: true });
        document.getElementById("timer").disabled = false;
        clearInterval(timer);
        return;
      }
      else if (this.state.gameComplete) {
        document.getElementById("timer").disabled = false;
        this.setState({ inMotion: false, playerWon: true });
        clearInterval(timer);
        return;
      }
      document.getElementById("timer").innerHTML = time - 1;
    }, 1000);
  };

  renderStart = () => {
    this.setState({ inMotion: true, gameComplete: false, playerWon: false }, () => {
      document.getElementById("timer").disabled = true;
      document.getElementById("clear-maze").click();
      document.getElementById("timer").innerHTML = "Get Ready"
      this.sleep(1000).then(this.startMaze);
    });
  };

  renderFinish = (id_on) => {
      if (id_on === END) {
          this.setState({gameComplete: true})
      }
  }

  render() {
    return (
      <div id="game">
        <Maze isComplete={this.renderFinish} gameComplete={this.state.gameComplete}/>
        <Timer
          onClick={this.renderStart}
          inMotion={this.state.inMotion}
          time_left={TIME_TO_BEAT}
          isComplete={this.state.gameComplete}
          playerWon={this.state.playerWon}
        />
      </div>
    );
  }
}

export default Game;
