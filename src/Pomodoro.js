import React from 'react';
import './Pomodoro.css';

const DEFAULT_TIME = 1500; // default pomodoro time seconds i.e 25min 
const DEFAULT_REDUCER = 60; // default time adjustment value is 25min, hence 60 seconds are reduced by default

class Pomodoro extends React.Component {
  constructor() {
    super();

    this.state = {
      time: {}, // this is the running time that appears
      seconds: DEFAULT_TIME, // total seconds that will elapse
      newTime: DEFAULT_TIME, // total new seconds that user sets
      playing: false, // playing status
      isHour: false, // used to determine if user is setting hour
      isMin: true, // used to determine if user is setting minute in the app, default is 25 min, hence min is active
      isSec: false, // used to determine if user is setting seconds
      condition: false
    }
    
    // last minute addition, audio notification when time is elapsed
    this.audio = new Audio("http://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
this.audio.controls = true;

    this.clock = null; // holds the set interval object, used for clearing the interval as well
    this.reducer = DEFAULT_REDUCER; // the value that is reduced from the total new seconds that timer will run for
    // checks whether the clock is active or not and accordingly initiates timer interval
    this.beginTimer = this.beginTimer.bind(this);
    // the function that is called every second, it updates time, seconds and playing status
    this.runner = this.runner.bind(this);
    // clears interval and few other values
    this.resetTimer = this.resetTimer.bind(this);
    // this is activated when user clicks PLUS/MINUS button to change the total elapsed time.
    this.updateNewTime = this.updateNewTime.bind(this);
    /* this method determines which part of the time user is settings and updates the reducer to appropriate second value e.g. if user selects hour, it updates reducer to 3600, now that 3600 will be deducted from the total seconds that will elapse */
    this.chooseSetter = this.chooseSetter.bind(this);	
  }
  
  chooseSetter(which) {
  	if ( which === 1 ) {
      this.setState({ isHour: true, isMin: false, isSec: false });
      this.reducer = 3600;
    } else if ( which === 2 ) {
      this.setState({ isHour: false, isMin: true, isSec: false });
      this.reducer = 60;
    } else {
      this.setState({ isHour: false, isMin: false, isSec: true });
      this.reducer = 1;
    }
  }

	/* Because we are dealing with seconds in whole application for consistency, I needed to function to transfrom seconds in various time components */
  formatTime(toTime) {
    let div = toTime % 3600,
        seconds = Math.ceil(div % 60);

    return {
      h: Math.floor(toTime / 3600), 
      m: Math.floor(div / 60), 
      s: seconds.toString().length === 1 ? "0" + seconds : seconds
    };
  }

  beginTimer() {
    this.clock === null && (this.clock = setInterval(this.runner, 1000));
    this.setState({
      condition: !this.state.condition
    });
  }
  
  runner() {
    let seconds = this.state.seconds - 1; // reducing total seconds, every second at a time
    this.setState({
      time: this.formatTime(seconds),
      seconds: seconds,
      playing: true
    });
		// elapsed
    (seconds === 0) && (clearInterval(this.clock), this.setState({ playing: false}), this.clock = null, this.audio.play(), this.setState({
      condition: !this.state.condition
    }));
  }

  resetTimer() {
    let seconds = this.state.newTime;
    this.setState({
      time: this.formatTime(seconds),
      seconds: seconds,
      playing: false
    });
    clearInterval(this.clock);
    this.clock = null;
    this.audio.pause();
    this.setState({
      condition: false
    });
  }

  updateNewTime(type) {
    let updatedTime = (type) ? this.state.newTime + this.reducer : this.state.newTime - this.reducer;    
    if( updatedTime < 0) { return; }
    this.state.playing ? this.setState({ newTime: updatedTime }) : this.setState({ newTime: updatedTime, seconds: updatedTime })
  }


  render() {
    return (
      <div>
        <div className="timer">
          {
            this.state.playing === true
              ? <span> 
                  <span className={ this.state.seconds < 3600 ? "hide" : "show" }>
                    { this.state.time.h }<span className="mini">h</span>
                    <span>:</span>
                  </span>
                  { this.state.time.m }<span className="mini">m</span>
                    <span>:</span>
                  { this.state.time.s }<span className="mini">s</span>
                </span>
              : <span>
                <span className={ this.state.seconds < 3600 ? "hide" : "show" }>
                  { this.formatTime(this.state.newTime).h }<span className="mini">h</span>:
                </span>
                { this.formatTime(this.state.newTime).m }<span className="mini">m</span>:
                { this.formatTime(this.state.newTime).s }<span className="mini">s</span>
              </span>
          }
        </div>

        <div className="controlBar">
          <div class="flex controlbox">
            <a href="#0" onClick={this.beginTimer} className= { this.state.condition ? "bttn launched start ft" : "bttn start ft" }>Start</a>
            <a href="#0" className="bttn reset ft" onClick={this.resetTimer}>Reset</a>
          </div>
        </div>

        <div className="flex updateTime">
          <a href="#0" className="bttn reduce" onClick={() => { this.updateNewTime(0) }}>-</a>
          
          <span className="freshTime">
            <span className={ this.state.isHour ? "dark" : "light" } onClick={ () => { this.chooseSetter(1) } }>
              { this.formatTime(this.state.newTime).h }                
              <span className="mini m0">h</span>
            </span>
            <span className={ this.state.isMin ? "dark" : "light" } onClick={ () => { this.chooseSetter(2) } }>
              { this.formatTime(this.state.newTime).m }
              <span className="mini m0">m</span>
            </span>
            <span className={ this.state.isSec ? "dark" : "light" } onClick={ () => { this.chooseSetter(3) } }>
              { this.formatTime(this.state.newTime).s }                
              <span className="mini m0">s</span>
            </span>
          </span>
          
          <a href="#0" className="bttn increase" onClick={() => { this.updateNewTime(1) }}>+</a>
        </div>
      </div>
    )
  }
}



export default Pomodoro;