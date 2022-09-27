import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import SendBird from 'sendbird';

import PopupContext from '../../context/Popup/PopupContext';
import CONSTANTS from '../../common/PeertalConstants';
import {
  getChannelList,
  create1to1GroupChannel,
  createGroupChannel,
  createChannelListHandler,
} from '../../actions/chatActions';
import UserObject from '../../models/UserObject';
import PersonChatItem from './PersonChatItem';
import ChatControlScreen from './ChatControlScreen';

const ChatControlScreenContainer = (props) => {

  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [currentTab, setCurrentTab] = useState('messages');
  const [tagList, setTagList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userState, setUserState] = useState(new UserObject());
  const [sb, setSb] = useState(new SendBird({ appId: CONSTANTS.SEND_BIRD.APP_ID }));
  const [channelList, setChannelList] = useState(null);
  const [isGroupchat, setIsGroupchat] = useState(null);

  useEffect(() => {
    let onChangedChannel = channel => {
      const pastChannelList = channelList || [];
      let updatedChannelList = [];
      let filterList = pastChannelList.filter(item => item.url == channel.url);
      if (pastChannelList.length == 0 || filterList.length == 0) {
        updatedChannelList = [channel, ...pastChannelList];
      } else {
        updatedChannelList = pastChannelList.map(item =>
          item.url == channel.url ? channel : item,
        );
      }
      setChannelList(updatedChannelList);
    };
    createChannelListHandler(sb, onChangedChannel);
  }, [])

  const isValidJSONString = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  const _loadChat = () => {
    setIsLoading(true);
    setUserState({
      _id: props.user.userId + '',
      fullName: props.user.fullName,
    });

    sb.connect(props.user.userId.toString(), (user, error) => {
      if (error) {
        alert('error at connect');
        return;
      }
      sb.updateCurrentUserInfo(
        props.user.fullName,
        props.user.avatarUrl,
        (res, error) => {
          if (error) {
            alert('error at updating user avatar');
          }
        },
      );
      setIsLoading(false);
      setUserState({
        _id: user.userId + '',
        avatar: user.profileUrl,
        name: user.nickname,
      });
      getChannelList(sb, channelListCallback => {
        setChannelList(channelListCallback);
      });
    });
  }

  const updateTagList = (list) => {
    setTagList(list);
  }

  const _handleSelectPersonCallback = (list) => {
    if (currentTab === 'messages') {
      setIsLoading(true);
      _create1To1Chat(list);
    } else {
      updateTagList(list);
    }
  }

  useEffect(() => {
    if (isGroupchat) {
      setIsLoading(true);
      if (tagList.length < 1) return;
      let userList = tagList.map(item => item.id.toString());
      userList.push(props.user.userId.toString());
      createGroupChannel(
        sb,
        userList,
        channel => {
          props.navigation.navigate('MainChat', {
            sb: sb,
            channel: channel,
            user: userState,
            header: tagList[0],
            channelUrl: channel.url,
          });
          setIsGroupchat(false);
        },
        error => {
          alert('error at creating channel');
          setIsLoading(false);
          setIsGroupchat(false);
        },
      );
    }
  }, [isGroupchat])

  const _create1To1Chat = (list) => {
    if (list.length < 1) return;
    let friend = list[0];
    let userList = [props.user.userId.toString(), friend.id.toString()];
    create1to1GroupChannel(
      sb,
      userList,
      channel => {
        props.navigation.navigate('MainChat', {
          sb: sb,
          channel: channel,
          user: userState,
          header: friend,
          channelUrl: channel.url,
        });
      },
      error => {
        setIsLoading(false);
        alert('error at creating channel');
      },
    );
  }

  const _renderItems = () => {
    let expectedMembers = currentTab == 'messages' ? 2 : 3;
    if (channelList == null) return null;
    return channelList.map((item, index) => {
      if (
        (item.members.length >= 3 && expectedMembers === 3) ||
        (item.members.length === 2 && expectedMembers === 2)
      ) {
        const members = item.members.filter(item => item.userId != props.user.userId);
        if (members.length == 0) return null;
        let fullName = '';
        members.forEach(member => {
          if (members[0] === member) {
            fullName += member.nickname;
          } else {
            fullName += ', ' + member.nickname;
          }
        });
        let chatTitle =
          item &&
            item.data &&
            isValidJSONString(item.data) &&
            JSON.parse(item.data)[props.user.userId] &&
            JSON.parse(item.data)[props.user.userId] != ''
            ? JSON.parse(item.data)[props.user.userId]
            : fullName;
        const unreadCount = item.unreadMessageCount || 0;
        let message = '...';
        let timeAgo = 'now';
        const lastMessage = item.lastMessage;
        if (lastMessage) {
          timeAgo = CONSTANTS.getTimeDifference(Number(lastMessage.createdAt));
          message = lastMessage.message;
        }
        return lastMessage ? (
          isLoading ? null : (
            <PersonChatItem
              unreadCount={unreadCount}
              timeAgo={timeAgo}
              message={message}
              chatTitle={chatTitle}
              user={props.user}
              data={item}
              key={index}
              currentTab={currentTab}
              callback={() => {
                props.navigation.navigate('MainChat', {
                  sb: sb,
                  channel: item,
                  user: userState,
                  header: new UserObject(),
                  channelUrl: item.url,
                });
              }}
            />
          )
        ) : null;
      }
    });
  }

  return (
    <ChatControlScreen
      {...props}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      tagList={tagList}
      isLoading={isLoading}
      _loadChat={_loadChat}
      _handleSelectPersonCallback={_handleSelectPersonCallback}
      _renderItems={_renderItems}
      setIsGroupchat={setIsGroupchat}
    />
  );
}

const mapStateToProps = store => ({
  user: store.user,
});
const ChatControlScreenContainerWrapper = connect(mapStateToProps)(ChatControlScreenContainer);
export default ChatControlScreenContainerWrapper;
