import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { NativeModules, AppState, Platform, View, TouchableOpacity, Text } from 'react-native';
import { css } from '@emotion/native';
import { Icon } from 'native-base';

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import { getLocationAtDiscover, getCurrentLocation } from '../../actions/commonActions';
import { fetchDiscoverPosts, refreshDiscoverPosts, getHashTagPosts } from '../../actions/postActions';
import { requestToReceivePushPermission, goToLink, getWalletDetails, getUserVerification } from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';
import { DiscoverLoading } from '../../components/CoreUIComponents';
import PostItem from '../../components/PostItem';
import { initChatConnectionToSendBird } from '../../actions/chatActions';
import PostsContext from '../../context/Posts/PostsContext';
import UserContext from '../../context/User/UserContext';
import HashTagPostScreen from './HashTagPostScreen';

const HashTagPostScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const hashTag = props.navigation.getParam('hashTag');
  const { hiddenPostId, setHiddenPostId } = useContext(PostsContext);

  const [isMounted, setIsMounted] = useState(false);
  const [postData, setPostData] = useState([]);

  const _onShow = () => {
  }

  useEffect(() => {
    handleLoadMore();
    setIsMounted(true);
  }, [])

  const handleRefresh = () => {
    getHashTagPosts(
      postData.push,
      props.user.accessToken,
        props.user.loggedStatus === "logged" ? props.user.subscribeToAdultContent : false,
        props.user.loggedStatus === "logged" ? props.user.over18 : false,
      hashTag,
      (res) => { setPostData(res.data.data.posts); },
      (err) => defaultError(err)
    );
  }

  const _renderHeader = () => {
    return (
      <View
        style={{
          height: 46,
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 0.1,
          alignItems: 'center',
        }}>
        <View
          style={headerStyle}>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={backButtonStyle}>
            <Icon name="arrowleft" type="AntDesign" />
          </TouchableOpacity>
          <View style={hashTitleStyle(CONSTANTS.WIDTH)}>
            <Text
              style={{
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,

              }}>
              #{hashTag}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const _generateKey = (a, b) => {
    return a.toString() + b.toString();
  }

  const handleLoadMore = () => {
    getHashTagPosts(
      postData.length,
      props.user.accessToken,
        props.user.loggedStatus === "logged" ? props.user.subscribeToAdultContent : false,
        props.user.loggedStatus === "logged" ? props.user.over18 : false,
      hashTag,
      (res) => { setPostData(prev => { return [...prev, ...res.data.data.posts] }); },
      (err) => defaultError(err)
    );
  }

  const _renderItem = ({ item, index }) => {
    if (hiddenPostId.some(id => id == item.id)) return null;
    return (
      <PostItem
        navigation={props.navigation}
        id={item.id}
        data={item}
        key={_generateKey(item.id, index)}
      />
    )
  }

  const _keyExtractor = (item, index) => item.id.toString();
  if (isMounted) {
    return (
      <HashTagPostScreen
        {...props}
        isMounted={isMounted}
        handleRefresh={handleRefresh}
        _renderHeader={_renderHeader}
        handleLoadMore={handleLoadMore}
        _renderItem={_renderItem}
        _keyExtractor={_keyExtractor}
        setPopup={setPopup}
        defaultError={defaultError}
        _onShow={_onShow}
        postData={postData}
      />
    );
  } else { return null; }
}

const headerStyle = css`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const backButtonStyle = css`
  margin: 0 10px;
`;

const hashTitleStyle = width => css`
  width: ${(width-100)+'px'};
  display: flex;
  align-items: center;
`;

const mapStateToProps = store => ({
  user: store.user,
});
const HashTagPostScreenContainerWrapper = connect(mapStateToProps)(HashTagPostScreenContainer);
export default HashTagPostScreenContainerWrapper;
