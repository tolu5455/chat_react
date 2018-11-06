import React, { Component } from 'react';
import {Provider} from 'react-redux'
import Login from './component/Login'
import store from './store/store'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2 style={{color: "black", fontSize: "40px"}}>Chat App</h2>
          <Provider store={store}>
            <div>
              <Login />
            </div>            
          </Provider>
        </header>
      </div>
    );
  }
}

export default App;
