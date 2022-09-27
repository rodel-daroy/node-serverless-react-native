import CONSTANTS from '../common/PeertalConstants';
import SendBird from 'sendbird';
import ChatControlScreen from '../screens/ChatControlScreen';
import user from '../reducers/user';

export const initChatConnectionToSendBird = (userId, userName, avatarUrl, callbackError) => {
  let sb = new SendBird({ appId: CONSTANTS.SEND_BIRD.APP_ID });
  sb.connect(userId, (user, error) => {
    if (error) {
      callbackError('error at connect to Chat server');
      return;
    }
    sb.updateCurrentUserInfo(userName, avatarUrl, (res, error) => {
      if (error) {
        callbackError('error at updating user avatar');
      }
    });
  });
};
export const enterGroupChannel = (sb, CHANNEL_ID, updateMessageFunction) => {
  registerChannel(sb, CHANNEL_ID, updateMessageFunction);
};
export const enterChannel = (
  sb,
  channelObject,
  callbackSuccess,
  callbackError,
  CHANNEL_ID,
  updateMessageFunction,
) => {
  channelObject.enter(function (response, error) {
    if (error) {
      return callbackError(error);
    }
    callbackSuccess(response);
    registerChannel(sb, CHANNEL_ID, updateMessageFunction);
  });
};

export const enterChannelURL = (
  sb,
  channelUrl,
  callbackSuccess,
  callbackError,
  CHANNEL_ID,
  updateMessageFunction,
) => {
  sb.GroupChannel.getChannel(channelUrl, function (openChannel, error) {
    if (error) {
      return callbackError(error);
    }
    let resChan, resRes;
    resChan = openChannel;
    resChan.enter(function (response, error) {
      if (error) {
        return callbackError(error);
      }
      resRes = response;
      callbackSuccess(resChan, resRes);
      registerChannel(sb, CHANNEL_ID, updateMessageFunction);
    });
  });
};
export const sendMessage = (
  openChannel,
  message,
  data = CONSTANTS.RANDOM_IMAGE,
  callbackSuccess,
  callbackError,
) => {
  openChannel.sendUserMessage(message, data, (message, error) => {
    if (error) {
      return callbackError(error);
    }
    callbackSuccess(message);
  });
};
export const createChannelListHandler = (sb, onChangedCallback) => {
  let channelHandler = new sb.ChannelHandler();
  channelHandler.onChannelChanged = channel => {
    onChangedCallback(channel);
  };
  sb.addChannelHandler('GROUP_CHANNEL_LIST_HANDLER', channelHandler);
};
export const registerChannel = (
  sb,
  CHANNEL_ID,
  onMessageReceivedCallback,
  onMessageDeletedCallback,
  onMessageUpdatedCallback,
  onReadReceiptUpdatedCallback,
) => {
  let channelHandler = new sb.ChannelHandler();
  channelHandler.onMessageReceived = (channel, message) => {
    onMessageReceivedCallback(channel, message);
  };
  channelHandler.onMessageDeleted = (channel, messageId) => {
    onMessageDeletedCallback(channel, messageId);
  };
  channelHandler.onMessageUpdated = (channel, message) => {
    onMessageUpdatedCallback(channel, message);
  };
  channelHandler.onReadReceiptUpdated = (channel) => {
    onReadReceiptUpdatedCallback(channel);
  };
  sb.addChannelHandler(CHANNEL_ID, channelHandler);
};
export const registerTypingEventOnChannel = (sb, CHANNEL_ID, callback) => {
  let channelHandler = new sb.ChannelHandler();
  channelHandler.onTypingStatusUpdated = channel => {
    callback(channel);
  };
  sb.addChannelHandler(CHANNEL_ID, channelHandler);
};
export const getChannelList = (sb, callbackSuccess, callbackError) => {
  let channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
  channelListQuery.includeEmpty = true;
  channelListQuery.limit = 50; // The value of pagination limit could be set up to 100.
  if (channelListQuery.hasNext) {
    channelListQuery.next(function (channelList, error) {
      if (error) {
        return callbackError(error);
      }
      callbackSuccess(channelList);
    });
  }
};
export const createGroupChannel = (
  sb,
  userList = [],
  callbackSuccess,
  callbackError,
) => {
  let filteredQuery = sb.GroupChannel.createMyGroupChannelListQuery();
  filteredQuery.userIdsExactFilter = userList;
  filteredQuery.next(function (channels, error) {
    if (error) return callbackError(error);
    if (channels.length === 0 || userList.length != channels[0].memberCount) {
      let NAME = '';
      for (let i = 0; i < userList.length; i++) NAME += '_' + userList[i];
      const COVER_URL = CONSTANTS.RANDOM_IMAGE;
      const DATA = '';
      sb.GroupChannel.createChannelWithUserIds(
        userList,
        true,
        NAME,
        COVER_URL,
        DATA,
        function (groupChannel, error) {
          if (error) {
            return callbackError(error);
          }
          return callbackSuccess(groupChannel);
        },
      );
      return;
    }
    callbackSuccess(channels[0]);
  });
};
export const create1to1GroupChannel = (
  sb,
  userList = [],
  callbackSuccess,
  callbackError,
) => {
  let filteredQuery = sb.GroupChannel.createMyGroupChannelListQuery();
  filteredQuery.userIdsExactFilter = userList;
  filteredQuery.next(function (channels, error) {
    if (error) return callbackError(error);
    if (channels.length === 0 || userList.length != channels[0].memberCount) {
      let NAME = '';
      for (let i = 0; i < userList.length; i++) NAME += '_' + userList[i];
      const COVER_URL = CONSTANTS.RANDOM_IMAGE;
      const DATA = '';
      sb.GroupChannel.createChannelWithUserIds(
        userList,
        true,
        NAME,
        COVER_URL,
        DATA,
        function (groupChannel, error) {
          if (error) {
            return callbackError(error);
          }
          return callbackSuccess(groupChannel);
        },
      );
      return;
    }
    callbackSuccess(channels[0]);
  });
};

export const getChannelChatHistory = (
  channel,
  callbackSuccess,
  callbackError,
) => {
  let messageListQuery = channel.createPreviousMessageListQuery();
  messageListQuery.limit = 30;
  messageListQuery.reverse = true;
  messageListQuery.load(function (messageList, error) {
    if (error) {
      return callbackError(error);
    }
    callbackSuccess(messageList);
  });
};

export const leaveChannel = (channel, callbackSuccess, callbackError) => {
  channel.leave(function (response, error) {
    if (error) {
      callbackError(error);
      return;
    }
    callbackSuccess(response);
  });
};

export const updateChannelTitle = (
  channel,
  name,
  coverUrl,
  newTitleObject,
  callbackSuccess,
  callbackError,
) => {
  channel.updateChannel(name, coverUrl, newTitleObject, (response, error) => {
    if (error) {
      callbackError(error);
      return;
    }
    callbackSuccess(response);
  });
};
