import React, { Component } from 'react';

const TIME_TO_BEAT = 3;

class Timer extends Component {

    startTimer = (clock) => {
        var timer = setInterval(() => {
            var time = this.props.time_left;
            if (time <= 0) {
                this.setState({time_left: TIME_TO_BEAT})
                this.stopTimer();
                return;
            }
            this.setState((state) => ({time_left: time - 1}))
        }, 1000);
        this.setState({timer: timer})
    }

    stopTimer = () => {
        clearInterval(this.state.timer);
    }

    beginGame = () => {
        if (this.props.inMotion) {
            this.startTimer(TIME_TO_BEAT)
        }
    }

    formatTimer = () => {
        if (this.props.inMotion) {
            return "btn btn-warning btn-lg btn-block"
        }
        else if (this.props.isComplete && !this.props.playerWon) {
            return "btn btn-danger btn-lg btn-block"
        }
        else {
            return "btn btn-success btn-lg btn-block"
        }
    }
    
    formatText = () => {
        if (this.props.inMotion) {
            return this.props.time_left;
        }
        else if (this.props.isComplete && this.props.playerWon) {
            return "You win! Click me to play again"
        }
        else if (this.props.isComplete) {
            return "Oof. Play again?"
        }
        else {
            return "Start Game"
        }
    }
    render() { 
        return (  
            <div id="timer-parent">
                <button onClick={this.props.onClick} id="timer" class={this.formatTimer()} >
                {this.formatText()}
                </button>
            </div>
        );
    }
}
 
export default Timer;