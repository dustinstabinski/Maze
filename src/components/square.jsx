import React, { Component } from "react";

class Sqaure extends Component {


  formatSquare = () => {
    let font = "btn btn-";
    if (this.props.id === this.props.squareOn){
      font += "warning";
    }
    else if (this.props.isStart || this.props.isEnd || this.props.isComplete) {
      font += "success";
    }
    else if (this.props.isWall) {
      font += "danger";
    }
    else {
      font += "primary"
    }
    return font;
  };

  keyDown = (event) => {
    if (event.key === "ArrowRight") {
      this.props.onMove("ArrowRight");
    }
    else if (event.key === "ArrowLeft") {
      this.props.onMove("ArrowLeft");
    }
    else if (event.key === "ArrowUp") {
      this.props.onMove("ArrowUp");
    }
    else if (event.key === "ArrowDown") {
      this.props.onMove("ArrowDown");
    }
  }

  


  render() {
    return (
      <React.Fragment>
        <button id={this.props.id} onClick={this.props.onClick} onKeyDown={this.keyDown} className="sqaure" class={this.formatSquare()}>
          {" "}
        </button>
      </React.Fragment>
    );
  }
}

export default Sqaure;
