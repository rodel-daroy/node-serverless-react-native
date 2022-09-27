import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PostItem from '../../components/PostItem';
import PersonRowItem from '../../components/PersonRowItem';
import { searchAction, loadData } from './SearchScreenFunctions';
import SearchScreen from './SearchScreen';

const SearchScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);

  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [tabSelected, setTabSelected] = useState('people');
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const _searchAction = (tab) => {
    searchAction(
      tab,
      text,
      setPeople,
      setIsLoading,
      setNoResults,
      setPosts,
      props.user.accessToken,
      defaultError
    );
  }

  const _loadData = () => {
    loadData(
      text,
      posts,
      people,
      tabSelected,
      setPeople,
      setIsLoading,
      setPosts,
      props.user.accessToken,
      defaultError
    );
  }

  const _keyExtractor = (item, index) => item.id + '' + index;

  const _renderItem = ({ item }) => {
    if (tabSelected == "people") return <PersonRowItem user={props.user} data={item} navigation={props.navigation} />;
    else return <PostItem navigation={props.navigation} data={item} />;
  };

  return (
    <SearchScreen
      {...props}
      isLoading={isLoading}
      text={props.text}
      setText={(value) => setText(value)}
      tabSelected={tabSelected}
      setTabSelected={(value) => setTabSelected(value)}
      posts={posts}
      people={people}
      noResults={noResults}
      setNoResults={(value) => setNoResults(value)}
      _searchAction={_searchAction}
      _loadData={_loadData}
      _keyExtractor={_keyExtractor}
      _renderItem={_renderItem}
    />
  );
}

const mapStateToProps = store => ({
  user: store.user,
});
const SearchScreenContainerWrapper = connect(mapStateToProps)(SearchScreenContainer);
export default SearchScreenContainerWrapper;