import React from 'react';
import {
  compose, withState, withHandlers,
} from 'recompose';
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
      operations={['>', '<']}
      showSearch
    />
  </div>
);

const Operations = ({
  operations, rightActive, leftActive, handleClick,
}) => (
  <div className="transfer-operations">
    <button type="button" className="transfer-btn" onClick={() => handleClick('right')} disabled={!rightActive}>{operations[0]}</button>
    <button type="button" className="transfer-btn" onClick={() => handleClick('left')} disabled={!leftActive}>{operations[1]}</button>
  </div>
);

const enchance = compose(
  withState('initialSourceItems', 'setInitialSourceItem', props => props.sourceitemsList),
  withState('initialDestinationItems', 'setInitialDestinationItem', props => props.destinationitemsList),
  withHandlers({
    handleChange: ({
      setInitialSourceItem, initialSourceItems, setInitialDestinationItem, initialDestinationItems,
    }) => async (data) => {
      data === 'source' ? setInitialSourceItem(initialSourceItems) : setInitialDestinationItem(initialDestinationItems);
    },
    handleClick: ({
      setInitialSourceItem, initialSourceItems, setInitialDestinationItem, initialDestinationItems,
    }) => async (direction) => {
      if (direction === 'right') {
        const tempSource = initialSourceItems.filter(item => item.selected !== true);
        let moveSourceToDestination = initialSourceItems.filter(item => item.selected === true);
        moveSourceToDestination = moveSourceToDestination.map(item => ({
          ...item,
          selected: false,
        }));
        await setInitialSourceItem(tempSource);
        await setInitialDestinationItem([...initialDestinationItems, ...moveSourceToDestination]);
      } else {
        const tempDestination = initialDestinationItems.filter(item => item.selected !== true);
        let moveDestinationToSource = initialDestinationItems.filter(item => item.selected === true);
        moveDestinationToSource = moveDestinationToSource.map(item => ({
          ...item,
          selected: false,
        }));
        await setInitialDestinationItem(tempDestination);
        await setInitialSourceItem([...initialSourceItems, ...moveDestinationToSource]);
      }
    },
  }),
);

const TransferContainer = enchance(({
  initialSourceItems, sourceTitle, showSearch, initialDestinationItems, destinationTitle, handleChange, handleClick, operations,
}) => {
  const rightActive = initialSourceItems.filter(item => item.selected === true).length > 0;
  const leftActive = initialDestinationItems.filter(item => item.selected === true).length > 0;
  return (
    <div className="transfer-grid">
      <TransferList
        itemsList={initialSourceItems}
        showSearch={showSearch}
        title={sourceTitle}
        handleChange={() => handleChange('source')}
      />
      <Operations operations={operations} rightActive={rightActive} leftActive={leftActive} handleClick={handleClick} />
      <TransferList
        itemsList={initialDestinationItems}
        showSearch={showSearch}
        title={destinationTitle}
        handleChange={() => handleChange('destination')}
      />
    </div>
  );
});

export default App;
