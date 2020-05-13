import React, { Component } from 'react';

class Timer extends Component {
    state = {time_left: 3}

    startTimer = () => {
        var timer = setInterval(() => {
            var time = this.state.time_left;
            console.log(time);
            time--;
            this.setState({time_left: time})
        }, 1000);
        this.setState({timer: timer});
    }

    stopTimer = () => {
        clearInterval(this.state.timer);
    }
    render() { 
        return (  
            <div id="timer">
                <button onClick={this.startTimer} class="btn btn-warning btn-lg btn-block" >
                {this.state.time_left}
                </button>
            </div>
        );
    }
}
 
export default Timer;