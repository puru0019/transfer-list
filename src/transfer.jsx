import React from 'react';
import { compose, withState, withHandlers } from 'recompose';

const enchance = compose(
    withState('data', 'setData',[]),
    withHandlers({
        onCheckAll: ({ setData }) => (e) => {
            console.log(e.target.checked);
        },
        handleCheckbox: ({}) => ({ target }) => {
            console.log(target.checked)
        }
    }),
)

const RenderList = ({ item : { text, selected, value }, handleCheckbox}) => {
    return (
        <li className="transfer-list-content-item">
            <input type="checkbox" id={`transfer-check-${value}`} onChange={handleCheckbox} checked={selected}/>
            {text}
        </li>
    )
}

const TransferListHeader = ({ title, totalItem, onCheckAll }) => {
    return (
        <div>
            <input type="checkbox" id={`check-all`} onClick={onCheckAll}/>
            <span>{totalItem}</span>
            <span>{title}</span>
        </div>
    )
}

const TransferList = enchance(({ itemsList, onCheckAll, handleCheckbox }) => {
    console.log(itemsList);
    return (
    <div className="transfer-grid">
        <TransferListHeader title="source" totalItem={itemsList.length} onCheckAll={onCheckAll} />
        <div className="transfer-list-body">
            <ul className="transfer-list-content">
                {
                    itemsList.map(item => <RenderList key={item.value} item={item} handleCheckbox={handleCheckbox} />)
                }
            </ul>
        </div>
    </div>
    )
});

export default TransferList;