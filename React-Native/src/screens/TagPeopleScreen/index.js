
import React, { memo, useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import { searchUsers } from '../../actions/peopleActions';
import CONSTANTS from '../../common/PeertalConstants';
import { Text } from '../../components/CoreUIComponents';
import PersonTagItem from './PersonTagItem';
import TagPeopleScreen from './TagPeopleScreen';

const TagPeopleScreenContainer = (props) => {

  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;
  const { defaultError } = useContext(DefaultErrorContext);

  const [searchText, setSearchText] = useState('');
  const [peopleList, setPeopleList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [selectedPeopleList, setSelectedPeopleList] = useState([]);
  const [idsOfSelected, setIdsOfSelected] = useState([]);

  useEffect(() => {

  }, [])

  const setCheckBack = (index, checked) => {
    let list = [...peopleList];
    let item = { ...list[index] };
    item.checked = checked;
    list[index] = item;
    let selectedList = [...selectedPeopleList];
    let itemIndex = selectedList.findIndex(
      selectedListItem => selectedListItem.id === item.id,
    );
    if (checked) {
      selectedList = itemIndex < 0 ? [...selectedList, item] : selectedList;
    } else {
      if (itemIndex >= 0) selectedList.splice(itemIndex, 1);
    }
    setPeopleList(list);
    setSelectedPeopleList(selectedList);
    setIdsOfSelected(selectedList.map((item, index) => {
      return item.id;
    }));
    props.navigation.getParam('callback')(selectedList);
  }

  const _handleSearch = () => {
    setIsLoading(true);
    searchUsers(
      props.user.accessToken,
      searchText,
      0,
      20,
      res => {
        let data = res.data.data.users;
        let addedCheckedData = data.map(item => {
          return idsOfSelected.includes(item.id)
            ? { ...item, checked: true }
            : item;
        });

        setPeopleList(addedCheckedData);
        setNoResults(res.data.data.users.length === 0 ? true : false);
        setIsLoading(false);
      },
      err => {
        alert(err.response?.data?.message ?? 'error some where');
        setIsLoading(false);
      },
    );
  }

  const _renderItems = () => {
    return peopleList.map((item, index) =>
      item.location && item.id != props.user.userId ? (
        <PersonTagItem
          key={index}
          data={item}
          callback={setCheckBack}
          index={index}
        />
      ) : null,
    );
  }

  const _renderNoResultsText = () => {
    return (
      <Text
        style={{
          marginTop: 20,
          marginHorizontal: 15,
          fontSize: 18,
          fontFamily: CONSTANTS.MY_FONT_FAMILY_LIGHT,
        }}>
        {noResults ? 'No results' : 'Please enter the keyword'}
      </Text>
    );
  }

  const _resetCheck = () => {
    setPeopleList(peopleList.map(item => ({
      ...item,
      checked: false,
    })));
    setSelectedPeopleList([]);
    setIdsOfSelected([]);
  }

  const _cancelCheck = () => {
    setPeopleList(peopleList.map(item => ({
      ...item,
      checked: false,
    })));
    setSelectedPeopleList([]);
    setIdsOfSelected([]);
    props.navigation.getParam('callback')([]);
  }

  const onClose = props.navigation.goBack;
  const title = props.navigation.getParam('title') || 'TAG FRIENDS';
  const rightButton = props.navigation.getParam('rightButton');
  const rightCallback = props.navigation.getParam('rightCallback') || onClose;
  const withDone = props.navigation.getParam('withDone') || false;

  return (
    <TagPeopleScreen
      {...props}
      searchText={searchText}
      setSearchText={setSearchText}
      peopleList={peopleList}
      isLoading={isLoading}
      setNoResults={setNoResults}
      _handleSearch={_handleSearch}
      _renderItems={_renderItems}
      _renderNoResultsText={_renderNoResultsText}
      _resetCheck={_resetCheck}
      onClose={onClose}
      title={title}
      rightButton={rightButton}
      rightCallback={rightCallback}
      withDone={withDone}
      _cancelCheck={_cancelCheck}
    />
  );
}

const MapStateToProps = store => ({ user: store.user });
const TagPeopleScreenContainerWrapper = connect(MapStateToProps)(TagPeopleScreenContainer);
export default memo(TagPeopleScreenContainerWrapper);
