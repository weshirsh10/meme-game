import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Redirect, Route, BrowserRouter as Router } from 'react-router-dom';
import LoginComponent from './login/login';
import GameComponent from './game/game'
import FirebaseService from './services/firebase'
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app



//initialize FB connection
 const firebase = new FirebaseService();
 firebase.initialize();

const routing = (
  <Router>
    <div id='routing-container'>
      <Route exact path='/' render={()=> <Redirect to="/login"/>}></Route>
      <Route path="/login" component={ LoginComponent }></Route>
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
