import { Icon } from 'native-base';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { GiftedChat, Send, MessageText, Bubble } from 'react-native-gifted-chat';
import ImageResizer from 'react-native-image-resizer';
import { connect } from 'react-redux';

import PopupContext from '../../context/Popup/PopupContext';
import {
  getChannelChatHistory,
  registerChannel,
  registerTypingEventOnChannel,
  sendMessage,
  leaveChannel,
  updateChannelTitle,
} from '../../actions/chatActions';
import { uploadMediaToPeertal } from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';
import { Text } from '../../components/CoreUIComponents';
import UserObject from '../../models/UserObject';
import * as CommonMessageHandler from '../../common/CommonMessageHandler';
import RNFS from 'react-native-fs';
import * as ReactNativeImagePicker from 'react-native-image-picker';
import { PhotoEditorWithImage } from '../../common/PhotoEditorHandler';
import MainChatScreen from './MainChatScreen';

class MainChatScreenContainer extends React.Component {

  static contextType = PopupContext;
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      text: '',
      media: null,
      messages: [],
      isLoading: false,
      channel: null,
      userState: { _id: 1, name: 'Kuky default' },
      sb: null,
      userHeader: new UserObject(),
      channelUrl: '',
      isTyping: false,
      typingMembers: [],
      minInputToolbarHeight: 45,
      isKeyboardUp: false,
      isLoadingImage: false,
      loadingPercent: {},
      groupChatTitle: '',
      originalMessages: [],
      isDialogVisible: false,
      key: false,
    };

    this._connectSB = this._connectSB.bind(this);
    this._enterChannel = this._enterChannel.bind(this);
    this._sendMessageToChannel = this._sendMessageToChannel.bind(this);
    this._getChatHistory = this._getChatHistory.bind(this);
    this._loadData = this._loadData.bind(this);
    this._resetData = this._resetData.bind(this);
    this.renderSend = this.renderSend.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this._handleTextChange = this._handleTextChange.bind(this);
    this._handleUploadPhoto = this._handleUploadPhoto.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this.onSend = this.onSend.bind(this);
    this._leaveGroupAction = this._leaveGroupAction.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
    this._onLongPress = this._onLongPress.bind(this);
    this.isValidJSONString = this.isValidJSONString.bind(this);
    this._updateChannelTitleAction = this._updateChannelTitleAction.bind(this);
    this.showMembers = this.showMembers.bind(this);
    this.displayStatus = this.displayStatus.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.setState({
      text: '',
      media: null,
      messages: [],
      isLoading: false,
      channel: null,
      userState: { _id: 1, name: 'Kuky default' },
      sb: null,
      userHeader: new UserObject(),
      channelUrl: '',
      isTyping: false,
      typingMembers: [],
      minInputToolbarHeight: 45,
      isKeyboardUp: false,
      isLoadingImage: false,
      loadingPercent: {},
      groupChatTitle: '',
      originalMessages: [],
      isDialogVisible: false,
    });
    this._resetData();
  }
  showMembers() {
    const { setPopup } = this.context;
    if (this.state.channel) {
      const membersArray = this.state.channel.members.map(
        item => item.nickname,
      );
      setPopup({ title: 'Members', main: membersArray.join('\n') });
    }
  }

  _onLongPress(context, message) {
    const { setPopup } = this.context;
    const originalMessage = this.state.originalMessages.filter(
      item => message._id == item.messageId,
    );
    if (
      originalMessage[0].customType == 'erased' ||
      message.user._id != this.props.user.userId
    ) {
      return;
    }
    setPopup({
      title: "Delete", main: 'Do you want to delete this message?', button: [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            setPopup("");
            if (message.user._id != this.props.user.userId) {
              setPopup({ title: 'Uh-oh', main: 'This is not your message.' });
              return;
            }
            this.setState({ isLoading: true });
            if (this.state.channel) {
              /* this.state.channel.deleteMessage(
                originalMessage[0],
                (response, error) => {
                  this.setState({isLoading: false});
                  if (error) {
                    callbackError(error);
                    return;
                  }
                  const currentMessages = this.state.messages.filter(
                    item => item._id != message._id,
                  );
                  this.setState({messages: currentMessages}, () =>
                    this.setState({isLoading: false}),
                  );
                },
              ); */

              this.state.channel.updateUserMessage(
                originalMessage[0].messageId,
                'This message was deleted.',
                '',
                'erased',
                (res, error) => {
                  this.setState({ isLoading: false });
                  if (error) {
                    callbackError(error);
                    return;
                  }
                  if (res) {
                    const pastMessages =
                      this.state.messages && this.state.messages;
                    const updatedMessages =
                      pastMessages &&
                      pastMessages.map(item =>
                        item._id == res.messageId
                          ? this._convertMessage(res)
                          : item,
                      );
                    const updatedOriginalMessages = this.state.originalMessages.map(
                      item => (item.messageId == res.messageId ? res : item),
                    );
                    this.setState({
                      messages: updatedMessages,
                      originalMessages: updatedOriginalMessages,
                    });
                    this.setState({ isLoading: false });
                  }
                },
              );
            }
          },
        },
      ]
    });
  }

  _leaveGroupAction() {
    const { setPopup } = this.context;
    leaveChannel(
      this.state.channel,
      res => {
        this.props.navigation.goBack();
      },
      err => setPopup('Error! when leaving this channel'),
    );
  }
  isValidJSONString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  _updateChannelTitleAction(newTitle) {
    const { setPopup } = this.context;
    const userId = this.props.user.userId;
    this.setState({ isLoading: true });
    const titleObject = JSON.parse(
      this.isValidJSONString(this.state.channel.data)
        ? this.state.channel.data
        : '{}',
    );
    titleObject[userId] = newTitle;
    updateChannelTitle(
      this.state.channel,
      this.state.channel.name,
      this.state.channel.coverUrl,
      JSON.stringify(titleObject),
      res => {
        const title = JSON.parse(
          this.isValidJSONString(res.data) ? res.data : '{}',
        );
        this.setState({
          groupChatTitle: title[userId] ? title[userId] : '',
          isLoading: false,
          isDialogVisible: false,
        });
      },
      err => {
        this.setState({ isLoading: false, isDialogVisible: false });
        setPopup('Error! when changing channel title');
      },
    );
  }

  onSend(messages = []) {
    if (this.state.isLoading == true) {
      return;
    }
    // this.setState(previousState => ({
    //   media: null,
    //   messages: GiftedChat.append(previousState.messages, messages)
    // }));
    if (this.state.text) this._sendMessageToChannel(messages[0].text);
    if (this.state.text == '' && this.state.media)
      this._sendMessageToChannel(messages[0].text + ' ');
  }

  _handleUploadPhoto(mediaType = 'photo') {
    const { setPopup } = this.context;
    const options = {
      noData: true,
      mediaType: mediaType,
      width: 800,
      height: 800,
      //quality: 0.7,
      maxHeight: 800,
      maxWidth: 800,
    };
    ReactNativeImagePicker.launchImageLibrary(options, response => {
      response.type == 'image/gif' || !response.type
        ? PhotoEditorWithImage(response.uri, result => {
          RNFS.readFile(result.image, 'base64').then(base64data => {
            this.setState({ isLoadingImage: true });
            uploadMediaToPeertal(
              this.props.user.accessToken,
              `data:${'image/jpeg'};base64,` + base64data,
              'post',
              res => {
                let response = res.data;
                if (response.status === 200) {
                  this.setState({
                    media: response.data,
                    isLoadingImage: false,
                  });
                } else {
                  setPopup(response.message);
                }
              },
              err => {
                this.setState({ isLoadingImage: false });
                setPopup(err.response?.data?.message ?? 'error some where');
              },
              event => this.setState({ loadingPercent: event }),
            );
          }),
            error => {
              const errorMessage = CommonMessageHandler.errorOutputByKey(
                error.code,
              );
              if (errorMessage !== 'no alert') {
                errorMessage == false
                  ? setPopup('cannot open camera')
                  : setPopup(errorMessage);
              }
            };
        })
        : ImageResizer.createResizedImage(response.uri, 800, 800, 'JPEG', 70)
          .then(resp => {
            if (resp.uri) {
              PhotoEditorWithImage(resp.uri, result => {
                RNFS.readFile(result.image, 'base64').then(base64data => {
                  this.setState({ isLoadingImage: true });
                  uploadMediaToPeertal(
                    this.props.user.accessToken,
                    `data:${'image/jpeg'};base64,` + base64data,
                    'post',
                    res => {
                      let response = res.data;
                      if (response.status === 200) {
                        this.setState({
                          media: response.data,
                          isLoadingImage: false,
                        });
                      } else {
                        setPopup(response.message);
                      }
                    },
                    err => {
                      this.setState({ isLoadingImage: false });
                      setPopup(err.response?.data?.message ?? 'error some where');
                    },
                    event => this.setState({ loadingPercent: event }),
                  );
                }),
                  error => {
                    const errorMessage = CommonMessageHandler.errorOutputByKey(
                      error.code,
                    );
                    if (errorMessage !== 'no alert') {
                      errorMessage == false
                        ? setPopup('cannot open camera')
                        : setPopup(errorMessage);
                    }
                  };
              });
            }
          })
          .catch(err => console.log(err));
    });
  }

  _resetData() {
    if (this.state.sb) {
      this.state.sb.removeChannelHandler('chatView');
      this.state.sb.removeChannelHandler('chatTyping');
    }
  }
  _loadData() {
    this.setState(
      {
        isLoading: true,
        sb: this.props.navigation.getParam('sb'),
        channel: this.props.navigation.getParam('channel'),
        userState: this.props.navigation.getParam('user'),
        userHeader: this.props.navigation.getParam('header'),
        channelUrl: this.props.navigation.getParam('channelUrl'),
        messages: [],
        userToken: this.props.navigation.getParam('userToken'),
      },
      () => {
        this._enterChannel();
        this._getChatHistory();
      },
    );
  }
  _convertMessage(item) {
    return {
      _id: item.messageId,
      text: item.message,
      image: item.data,
      customType: item.customType,
      user: {
        _id: item._sender.userId,
        name: item._sender.nickname,
        avatar: item._sender.profileUrl,
      },
      createdAt: item.createdAt,
      unread: this.state.channel.getReadReceipt(item),
    };
  }
  _getChatHistory() {
    const { setPopup } = this.context;
    getChannelChatHistory(
      this.state.channel,
      messages => {
        this.setState(
          {
            originalMessages: messages,
            messages: messages.map(item => this._convertMessage(item)),
          },
          () => {
            this.setState({ isLoading: false });
          },
        );
      },
      error => {
        this.setState({ isLoading: false });
        setPopup('Error! when loading chat history');
      },
    );
  }
  _connectSB(callback) {
    const { setPopup } = this.context;
    this.setState({ isLoading: true });
    let _self = this;
    this.state.sb.connect(USER_ID, (user, error) => {
      if (error) {
        setPopup('error at connect');
        return;
      }
      _self.setState({
        isLoading: false,
        userState: { _id: user.userId, avatar: user.profileUrl, name: user.nickname },
      });
    });
  }
  _enterChannel() {
    let _self = this;
    let channelId = 'chatView';
    let onReceiveMessage = (channel, message) => {
      if (channel.url == _self.state.channel.url)
        this.setState({
          originalMessages: [message, ...this.state.originalMessages],
          messages: [this._convertMessage(message), ...this.state.messages],
        });
    };
    let onDeleteMessage = (channel, messageId) => {
      if (channel.url == _self.state.channel.url) {
        const currentMessages = _self.state.messages.filter(
          item => item._id != messageId,
        );
        this.setState({
          messages: currentMessages,
        });
      }
    };
    let onUpdateMessage = (channel, message) => {
      if (channel.url == _self.state.channel.url) {
        const pastMessages = this.state.messages && this.state.messages;
        const updatedMessages =
          pastMessages &&
          pastMessages.map(item =>
            item._id == message.messageId
              ? this._convertMessage(message)
              : item,
          );
        this.setState({
          messages: updatedMessages,
        });
      }
    };
    let onUpdateReadStatus = channel => {
      if (channel.url == _self.state.channel.url) {
        this.setState({ channel: channel }, () => {
          const updatedMessages =
            this.state.originalMessages &&
            this.state.originalMessages.map(item => this._convertMessage(item));
          this.setState({
            messages: updatedMessages,
          });
        });
      }
    };
    registerChannel(
      this.state.sb,
      channelId,
      onReceiveMessage,
      onDeleteMessage,
      onUpdateMessage,
      onUpdateReadStatus,
    );
    //register event handler
    let channelTypingId = 'chatTyping';
    let onMembersTyping = channel => {
      if (channel.url == _self.state.channel.url) {
        let mems = channel.getTypingMembers();
        _self.setState({ isTyping: mems.length > 0, typingMembers: mems });
      }
    };
    registerTypingEventOnChannel(
      this.state.sb,
      channelTypingId,
      onMembersTyping,
    );
  }
  _handleTextChange(text) {
    this.setState({ text: text });
    if (this.state.channel) {
      this.state.channel.startTyping();
    }
  }
  _sendMessageToChannel(message) {
    const { setPopup } = this.context;
    this.state.channel.endTyping();
    const data = this.state.media ? this.state.media.url : '';
    // this.setState({ isLoading: true });
    sendMessage(
      this.state.channel,
      message,
      data,
      message => {
        // this.setState({ isLoading: false, media: null });
        this.setState(previousState => ({
          media: null,
          text: '',
          originalMessages: GiftedChat.append(previousState.originalMessages, [
            message,
          ]),
          messages: GiftedChat.append(previousState.messages, [
            this._convertMessage(message),
          ]),
        }));
      },
      error => {
        setPopup(error);
      },
    );
  }
  displayStatus(message) {
    const ownerId = message.user._id;
    const userId = this.props.user.userId;
    if (message.customType == 'erased' || message.unread == 0) return;
    return (
      <View style={{}}>
        <Text
          style={{
            color: ownerId == userId ? '#ffffff' : '#333333',
            fontSize: 11,
            marginTop: -1,
            marginRight: 10,
          }}>
          unread : {message.unread}
        </Text>
      </View>
    );
  }
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color:
              props.currentMessage.customType &&
                props.currentMessage.customType == 'erased'
                ? '#c6c6c6'
                : 'white',
          },
          left: {
            color:
              props.currentMessage.customType &&
                props.currentMessage.customType == 'erased'
                ? '#c6c6c6'
                : '#333333',
          },
        }}
        wrapperStyle={{
          right: {
            backgroundColor:
              props.currentMessage.customType &&
                props.currentMessage.customType == 'erased'
                ? 'rgb(255,255,255)'
                : CONSTANTS.MY_BLUE,
          },
          left: {
            backgroundColor:
              props.currentMessage.customType &&
                props.currentMessage.customType == 'erased'
                ? 'rgb(255,255,255)'
                : 'rgba(128,128,128,0.05)',
          },
        }}
      />
    );
  }

  renderSend(props) {
    let _self = this;
    return (
      <Send {...props}>
        <View
          style={{
            marginRight: 10,
            marginBottom: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {_self.state.media ? (
            <View>
              <Image
                source={{ uri: _self.state.media.url }}
                style={{ height: 40, width: 40, marginRight: 15 }}
              />
              <TouchableOpacity
                style={{ marginTop: -40, marginLeft: 25 }}
                onPress={() =>
                  this.state.isLoading ? null : _self.setState({ media: null })
                }>
                <Icon
                  name="ios-close-circle"
                  style={{ color: 'red', fontSize: 16 }}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          <TouchableOpacity
            onPress={() =>
              this.state.isLoading ? null : _self._handleUploadPhoto()
            }
            style={{ marginRight: 15 }}>
            <Icon name="ios-camera" />
          </TouchableOpacity>
          <Icon name="send" />
        </View>
      </Send>
    );
  }
  renderMessageText(props) {
    const textStyle = {
      fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
    };
    return (
      <MessageText textStyle={{ left: textStyle, right: textStyle }} {...props} />
    );
  }
  _renderFooter() {
    let typingText = '';
    if (this.state.typingMembers.length > 0) {
      typingText = this.state.typingMembers[0].nickname + ' is typing';
    }
    return <Text style={{ color: 'red' }}>{/* typingText */}</Text>;
  }
  render() {
    let groupAvatar = null;
    if (this.state.channel) {
      groupAvatar = this.state.channel.members.map(item => item.profileUrl);
    }
    let defaultChatTitle = 'Chat with ';
    if (this.state.channel) {
      const members = this.state.channel.members.filter(
        item => item.userId != this.state.userState._id,
      );
      if (members.length > 0) {
        let i = 0;
        for (i = 0; i < members.length; i++)
          defaultChatTitle +=
            members[i].nickname + (i < members.length - 1 ? ', ' : '');
      }
    }
    let chatTitle =
      this.state.channel &&
        this.state.channel.data &&
        this.isValidJSONString(this.state.channel.data) &&
        JSON.parse(this.state.channel.data)[this.props.user.userId]
        ? this.state.groupChatTitle != ''
          ? this.state.groupChatTitle
          : JSON.parse(this.state.channel.data)[this.props.user.userId]
        : defaultChatTitle;
    const avatarUrl = this.state.userHeader.avatarUrl || CONSTANTS.RANDOM_IMAGE;
    if (this.state.channel) this.state.channel.markAsRead();
    //options for action sheet
    const options = [
      <Text style={{ color: CONSTANTS.MY_BLUE, fontSize: 17, fontWeight: '500' }}>
        See Members
      </Text>,
      <Text style={{ color: CONSTANTS.MY_BLUE, fontSize: 17, fontWeight: '500' }}>
        Change Group Name
      </Text>,
      <Text style={{ color: 'red', fontSize: 17, fontWeight: '500' }}>
        Leave
      </Text>,
      'Cancel',
    ];

    return (
      <MainChatScreen
        {...this.props}
        isDialogVisible={this.state.isDialogVisible}
        setIsDialogVisible={(value) => this.setState({ isDialogVisible: value })}
        isLoadingImage={this.state.isLoadingImage}
        setIsLoadingImage={(value) => this.setState({ setIsLoadingImage: value })}
        text={this.state.text}
        messages={this.state.messages}
        isLoading={this.state.isLoading}
        userState={this.state.userState}
        loadingPercent={this.state.loadingPercent}

        showMembers={this.showMembers}
        _onLongPress={this._onLongPress}
        _leaveGroupAction={this._leaveGroupAction}
        _updateChannelTitleAction={this._updateChannelTitleAction}
        onSend={this.onSend}
        _resetData={this._resetData}
        _loadData={this._loadData}
        _handleTextChange={this._handleTextChange}
        _sendMessageToChannel={this._sendMessageToChannel}
        displayStatus={this.displayStatus}
        renderBubble={this.renderBubble}
        renderSend={this.renderSend}
        renderMessageText={this.renderMessageText}
        _renderFooter={this._renderFooter}

        groupAvatar={groupAvatar}
        chatTitle={chatTitle}
        options={options}
      />
    );
  }
}

const mapStateToProps = store => ({
  user: store.user,
});
const MainChatScreenContainerWrapper = connect(mapStateToProps)(MainChatScreenContainer);
export default MainChatScreenContainerWrapper;
