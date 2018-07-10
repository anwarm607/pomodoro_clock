import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Pomodoro from './Pomodoro';
import registerServiceWorker from './registerServiceWorker';


class Index extends React.Component {
	render() {
	return (
    <div className="App">
      <Pomodoro />
    </div>
  );	
	}
}

ReactDOM.render(
  <Index />,
  document.getElementById('application')
)
