import React, { Component } from 'react';
import 'foundation-sites/dist/css/foundation.min.css';
import './App.css';
import Hotels from "./Containers/Hotels/index";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>* HOTELS *</h1>
        </header>
        <Router>
          <div className="App-content">
            <Switch>
              <Route exact path="/" component={Hotels} />
            </Switch>
          </div>
        </Router>
        <footer className="App-footer">
          <p className="footerText">© 2018 Hotel Info Limited. All Rights Reserved</p>
        </footer>
      </div>
    );
  }
}

export default App;
