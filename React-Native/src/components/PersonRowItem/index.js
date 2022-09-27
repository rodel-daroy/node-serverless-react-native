import React, { useState, useEffect, useContext } from 'react';
import SendBird from 'sendbird';

import PopupContext from '../../context/Popup/PopupContext';
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import CONSTANTS from '../../common/PeertalConstants';
import { goToProfile } from '../../actions/userActions';
import { create1to1GroupChannel } from '../../actions/chatActions';
import UserProfileObject from '../../models/UserProfileObject.js';
import { getUserProfile } from '../../actions/peopleActions';
import { reportToPerson } from '../../actions/userActions';
import PersonRowItem from './PersonRowItem';

const PersonRowItemContainer = (props) => {
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;
  const { defaultError } = useContext(DefaultErrorContext);

  const { data } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [personData, setPersonData] = useState(new UserProfileObject());
  const [sb, setSb] = useState(new SendBird({ appId: CONSTANTS.SEND_BIRD.APP_ID }));

  useEffect(() => {
    setIsLoading(true);
    const personId = props.data.id;
    getUserProfile(props.user.accessToken, personId, res => {
      let personRes = res.data.data.user_data;
      setIsLoading(false);
      setPersonData(personRes);
    },
      (err) => { defaultError(err) });
  }, [])

  const handleTouchOnAvatar = () => {
    // const pushAction = StackActions.push({
    //   routeName: "UserProfile",
    //   params: {
    //     userId: props.data.id
    //   }
    // });
    // props.navigation.dispatch(pushAction);
    goToProfile(props.navigation, props.data.id);
    // props.navigation.navigate("UserProfile", { userId: props.data.id });
  }

  const create1To1Chat = (list) => {
    if (list.length < 1) return;
    let user = props.user;
    let friend = list[0];
    let userList = [props.user.userId.toString(), friend.id.toString()];
    create1to1GroupChannel(
      sb,
      userList,
      channel => {
        props.navigation.navigate('MainChat', {
          sb: sb,
          channel: channel,
          user: {
            _id: JSON.stringify(user.userId),
            avatar: user.avatarUrl,
            name: user.fullName,
          },
          header: friend,
          channelUrl: channel.url,
        });
      },
      err => alert(err.response?.data?.message ?? 'error some where'),
    );
  }

  const _handleReport = () => {
    reportToPerson(
      props.user.accessToken,
      { id: personData.id, type: 'USER', type: 'report' },
      res => {
        alert('Reported successfully');
      },
      err => {
        alert(err.response?.data?.message ?? 'error some where');
      },
    );
  }

  const avatarSource = data.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
  const fullName = data.fullName;
  const occupation = data.occupation || 'Global citizen';
  const locationAddress = data.address || 'somewhere in the world';
  const introduction = data.introduction || '...';
  const options = ['Post', 'Message', 'Report', 'Cancel'];
  return (
    <PersonRowItem
      {...props}
      personData={personData}
      handleTouchOnAvatar={handleTouchOnAvatar}
      create1To1Chat={create1To1Chat}
      _handleReport={_handleReport}
      avatarSource={avatarSource}
      fullName={fullName}
      occupation={occupation}
      locationAddress={locationAddress}
      introduction={introduction}
      options={options}
    />
  );
}

export default PersonRowItemContainer;