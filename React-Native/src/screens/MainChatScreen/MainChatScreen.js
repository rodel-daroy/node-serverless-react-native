import React, { useRef } from 'react';
import { Icon } from 'native-base';
import { TouchableOpacity, View, Modal, Alert, } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import { NavigationEvents } from 'react-navigation';

import DialogInput from 'react-native-dialog-input';
import CONSTANTS from '../../common/PeertalConstants';
import { Text, LoadingSpinner } from '../../components/CoreUIComponents';
import ProgressBar from '../../components/CoreUIComponents/ProgressBar';
import GroupAvatars from '../../components/GroupAvatars';

const MainChatScreen = (props) => {

  const {
    isDialogVisible,
    setIsDialogVisible,
    isLoadingImage,
    setIsLoadingImage,
    text,
    messages,
    isLoading,
    userState,
    loadingPercent,

    showMembers,
    _onLongPress,
    _leaveGroupAction,
    _updateChannelTitleAction,
    onSend,
    _resetData,
    _loadData,
    _handleTextChange,
    _sendMessageToChannel,
    displayStatus,
    renderBubble,
    renderSend,
    renderMessageText,
    _renderFooter,

    groupAvatar,
    chatTitle,
    options,
  } = props;

  const refActionSheet = useRef(null);
  const showActionSheet = () => {
    if (refActionSheet.current) {
      refActionSheet.current.show();
    }
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        marginTop: CONSTANTS.SPARE_HEADER,
      }}>
      <NavigationEvents
        onWillFocus={_loadData}
        onWillBlur={_resetData}
      />
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
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() =>
              isLoading ? null : props.navigation.navigate('ChatControl')
            }
            style={{
              // alignSelf: "flex-start",
              marginLeft: 10,
              marginRight: 10,
            }}>
            <Icon name="arrowleft" type="AntDesign" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (isLoading ? null : showMembers())}
            style={{}}>
            <GroupAvatars data={groupAvatar} />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 10,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              maxWidth: 200 * CONSTANTS.WIDTH_RATIO,
            }}>
            {chatTitle}
          </Text>
        </View>
        <TouchableOpacity
          onPress={isLoading ? null : showActionSheet}>
          <Icon
            name="dots-three-vertical"
            type="Entypo"
            style={{
              fontSize: 16,
              fontWeight: '200',
              marginRight: 10,
              marginTop: 10,
            }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: 'absolute',
          left: '50%',
          top: '30%',
        }}>
        {isLoading ? <LoadingSpinner /> : null}
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        onInputTextChanged={_handleTextChange}
        style={{ marginBottom: 100, flex: 0.9 }}
        text={text}
        user={userState}
        showAvatarForEveryMessage={true}
        alwaysShowSend={true}
        isAnimated={true}
        showUserAvatar={true}
        onLongPress={(context, message) =>
          _onLongPress(context, message)
        }
        renderTicks={message => displayStatus(message)}
        placeholder="Type a message"
        renderFooter={_renderFooter}
        renderSend={renderSend}
        renderBubble={renderBubble}
        renderMessageText={renderMessageText}
        textInputProps={{
          returnKeyType: 'send',
          onSubmitEditing: () => {
            _sendMessageToChannel(text);
          },
        }}
      />
      <ActionSheet
        ref={refActionSheet}
        title={'Which action do you like to do?'}
        options={options}
        cancelButtonIndex={options.length - 1}
        destructiveButtonIndex={1}
        onPress={index => {
          /* do something */
          switch (index) {
            case 0:
              showMembers();
              break;
            case 2:
              _leaveGroupAction();
              break;
            case 1:
              if (CONSTANTS.OS == 'ios') {
                Alert.prompt(
                  'New Title',
                  'Enter the new title for this group chat',
                  title => _updateChannelTitleAction(title),
                );
              } else {
                setIsDialogVisible (true);
              }
              break;
            default:
          }
        }}
      />
      <View style={{ height: CONSTANTS.SPARE_FOOTER + 25 }} />
      <DialogInput
        isDialogVisible={isDialogVisible        }
        title={'New Title'}
        message={'Enter the new title for this group chat'}
        submitInput={inputText => {
          _updateChannelTitleAction(inputText);
        }}
      />
      <Modal
        visible={isLoadingImage}
        transparent={true}
        onRequestClose={() => setIsLoadingImage(false)}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            marginHorizontal: 16,
            justifyContent: 'flex-start',
          }}>
          <View style={{ flex: 0.95 }} />
          <ProgressBar
            style={{ flex: 0.05 }}
            data={
              loadingPercent.total
                ? (
                  (loadingPercent.loaded * 100) /
                  loadingPercent.total
                ).toFixed(0)
                : 5
            }
          />
        </View>
      </Modal>
    </View>
  );
}

export default MainChatScreen;
