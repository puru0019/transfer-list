import React from 'react';
import './App.css';
import TransferList from './transfer';
import { response, response1 } from './data';

const App = () => (
  <div className="row">
    <TransferContainer
      sourceitemsList={response}
      destinationitemsList={response1}
      sourceTitle="Soruce"
      destinationTitle="Destination"
      showSearch
    />
  </div>
);

const TransferContainer = ({
  sourceitemsList, sourceTitle, showSearch, destinationitemsList, destinationTitle,
}) => (
  <div className="transfer-grid">
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
  </div>
);

export default App;
