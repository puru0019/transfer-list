import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TransferList from './transfer';
import  response  from './data';

class App extends Component {
  render() {
    return (
      <div className="row">
        <TransferList 
          itemsList={response}
        />
      </div>
    );
  }
}

export default App;
