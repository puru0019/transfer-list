import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TransferList from './transfer';
import  response  from './data';

class App extends Component {
  render() {
    return (
      <div className="row">
        <TransferContainer 
          sourceitemsList={response}
          destinationitemsList={response}
          sourceTitle="Soruce"
          destinationTitle="Destination"
          showSearch={true}
        />
      </div>
    );
  }
}

const TransferContainer = ({ sourceitemsList, destinationitemsList, sourceTitle, destinationTitle ,showSearch }) => {
  return (
    <React.Fragment>
      <TransferList 
        itemsList={sourceitemsList}
        showSearch={showSearch}
        title={sourceTitle}
      />
      <TransferList 
        itemsList={destinationitemsList}
        showSearch={showSearch}
        title={destinationTitle}
      />
    </React.Fragment>
  )
}

export default App;
