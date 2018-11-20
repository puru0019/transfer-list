import React from 'react';
import {
  compose, withState, withHandlers, lifecycle, withPropsOnChange,
} from 'recompose';

const enchance = compose(
  withState('initialItemsList', 'setItemsList', props => props.itemsList),
  withState('filterItemsList', 'setFilterItemsList', []),
  withState('itemsCount', 'setItemsCount'),
  withState('checkAllStatus', 'setCheckAllStatus', false),
  withState('searchText', 'setSearchText', ''),
  withHandlers({
    handleCheckBox: ({
      initialItemsList, setItemsList, setCheckAllStatus, itemsCount, handleChange,
    }) => async ({ target }) => {
      const items = initialItemsList.map((item) => {
        if (item.value === target.value) {
          item.selected = target.checked;
        }
        return item;
      });
      await setItemsList(items);
      const getCheckedCount = initialItemsList.filter(item => item.selected === true).length;
      (itemsCount === getCheckedCount) ? await setCheckAllStatus(true) : await setCheckAllStatus(false);
      handleChange();
    },
    handleAllCheckBox: ({
      initialItemsList, setCheckAllStatus, setItemsList, handleChange,
    }) => async ({ target }) => {
      initialItemsList.map(item => (item.selected = target.checked));
      await setCheckAllStatus(target.checked);
      await setItemsList(initialItemsList);
      handleChange();
    },
    handleFilter: ({
      initialItemsList, setSearchText, setFilterItemsList, setItemsCount,
    }) => async ({ target }) => {
      const updatedItems = initialItemsList.filter(item => item.text.toLowerCase().search(target.value.toLowerCase()) !== -1);
      await setSearchText(target.value);
      await setFilterItemsList(updatedItems);
      await setItemsCount(updatedItems.length);
    },
  }),
  withPropsOnChange(['itemsList'], ({
    setFilterItemsList, itemsList, setItemsCount, setItemsList, setCheckAllStatus, searchText,
  }) => {
    searchText ? setFilterItemsList(itemsList.filter(item => item.text.toLowerCase().search(searchText.toLowerCase()) !== -1)) : setFilterItemsList(itemsList);
    setItemsList(itemsList);
    setItemsCount(itemsList.length);
    itemsList.length && itemsList.filter(item => item.selected === true).length === itemsList.length ? setCheckAllStatus(true) : setCheckAllStatus(false);
  }),
  lifecycle({
    componentWillMount() {
      this.props.setFilterItemsList(this.props.itemsList);
    },
  }),
);

const TransferListContentItem = ({ item: { text, value, selected }, handleCheckBox }) => (
  <li className="transfer-list-content-item">
    <label htmlFor={value}>
      <input type="checkbox" id={value} value={value} className="transfer-checkbox" checked={selected} onChange={handleCheckBox} />
      {text}
    </label>
  </li>
);

const TransferListContent = ({ filterItemsList, ...props }) => (
  <ul className="transfer-list-content">
    {
      filterItemsList.map(item => <TransferListContentItem key={item.value} item={item} {...props} />)
    }
  </ul>
);

const TransferListHeader = ({
  itemsCount, checkAllStatus, handleAllCheckBox, title,
}) => (
  <div className="transfer-list-header">
    <label htmlFor={`check-all-${title}`}>
      <input type="checkbox" id={`check-all-${title}`} checked={checkAllStatus} className="transfer-checkbox" onChange={handleAllCheckBox} />
      {itemsCount}
      {'  items'}
    </label>
  </div>
);

const NoResultsFound = () => (
  <div className="transfer-list-content">
    No results found
  </div>
);

const TransferListSearch = ({ searchText, handleFilter }) => (
  <div className="transfer-list-search">
    <input type="text" value={searchText} onChange={handleFilter} />
  </div>
);

const TransferList = enchance(({
  filterItemsList, title, itemsCount, checkAllStatus, searchText, handleCheckBox, handleAllCheckBox, handleFilter,
}) => (
  <div className="root-grid">
    <div className="transfer-list-title">
      {title}
    </div>
    <div className="transfer-list-body">
      <TransferListHeader itemsCount={itemsCount} checkAllStatus={checkAllStatus} handleAllCheckBox={handleAllCheckBox} title={title} />
      <div className="transfer-list-content-body">
        <TransferListSearch searchText={searchText} handleFilter={handleFilter} />
        { filterItemsList.length > 0 && <TransferListContent filterItemsList={filterItemsList} handleCheckBox={handleCheckBox} />}
        { filterItemsList.length === 0 && <NoResultsFound />}
      </div>
    </div>
  </div>
));

export default TransferList;
