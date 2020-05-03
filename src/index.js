import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import LoginComponent from './login/login';
import LobbyComponent from './lobby/lobby'
import GameComponent from './game/game'
import FirebaseService from './services/firebase'


//initialize FB connection
 const firebase = new FirebaseService();
 firebase.initialize();

const routing = (
  <Router>
    <div id='routing-container'>
      <Route path="/login" component={ LoginComponent }></Route>
      <Route path="/lobby/:room/:name" component={ LobbyComponent }></Route>
      <Route path="/game/:room/:name" component={ GameComponent }></Route>
    </div>
  </Router>
);

ReactDOM.render(
  routing,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
