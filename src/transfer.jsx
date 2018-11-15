import React from 'react';
import { compose, withState, withHandlers, lifecycle } from 'recompose';

const enchance = compose(
    withState('initialItemList', 'setItemsList',props=> props.itemsList),
    withState('filterItemList', 'setFilterItemsList',[]),
    withState('checkAllStatus','setCheckAll', false),
    withState('totalItems', 'setTotalItems', props=>props.itemsList.length),
    withState('searchText', 'setSearchText',''),
    withHandlers({
        onCheckAll: ({ initialItemList, setItemsList, setCheckAll }) => async(e) => {
            initialItemList.map(item => item.selected = e.target.checked);
            await setCheckAll(e.target.checked);
            await setItemsList(initialItemList);
        },
        handleCheckbox: ({ initialItemList, totalItems, setItemsList, setCheckAll }) => async({ target }) => {
            let items = initialItemList.map(( item ) => { 
                if(item.value === target.value) {
                    item.selected = target.checked
                }
                return item;
            });
            await setItemsList(items);
            let getStatus = getCheckAllStatus(initialItemList, totalItems);
            getStatus ? await setCheckAll(true) : await setCheckAll(false);
        },
        handleFilter: ({ initialItemList, setSearchText, setFilterItemsList }) => async(e) => {
            let updatedItems = initialItemList.filter(item => item.text.toLowerCase().search(e.target.value.toLowerCase()) !== -1);
            await setSearchText(e.target.value);
            await setFilterItemsList(updatedItems);
        }
    }),
    lifecycle({
        componentWillMount() {
            this.props.setFilterItemsList(this.props.initialItemList)
        }
    })
)

const getCheckAllStatus = (initialItemList, totalItems) => {
    let count = 0;
    initialItemList.map(item => {
        if(item.selected === true) {
            count = count + 1;
        }
        return count;
    });
    return count === totalItems ? true : false;
}

const RenderList = ({ item : { text, selected, value }, handleCheckbox}) => {
    return (
        <li className="transfer-list-content-item">
            <input type="checkbox" value={value} onChange={handleCheckbox} checked={selected}/>
            {text}
        </li>
    )
}

const TransferListHeader = ({ title, totalItems, showSearch, onCheckAll, searchText, checkAllStatus, handleFilter }) => {
    return (
        <div>
            { showSearch && 
                <div>
                    <input type="text" value={searchText} onChange={handleFilter}/>
                </div>
            }
            <input type="checkbox" id={`check-all`} onChange={onCheckAll} checked={checkAllStatus}/>
            <span>{totalItems}</span>
            <span>{title}</span>
        </div>
    )
}

const TransferList = enchance(({ filterItemList, title, showSearch, onCheckAll, totalItems, searchText, handleCheckbox, handleFilter, checkAllStatus }) => {
    return (
    <div>
        <h3>{title}</h3>
        <div className="transfer-grid">
            <TransferListHeader title="source" showSearch={showSearch} searchText={searchText} totalItems={totalItems} onCheckAll={onCheckAll} checkAllStatus={checkAllStatus} handleFilter={handleFilter}/>
            <div className="transfer-list-body">
                <ul className="transfer-list-content">
                    {
                    filterItemList && filterItemList.map(item => <RenderList key={item.value} item={item} handleCheckbox={handleCheckbox} />)
                    }
                    {
                    filterItemList.length === 0 && <div>No result found</div>
                    }
                </ul>
            </div>
        </div>
    </div>
    )
});

export default TransferList;