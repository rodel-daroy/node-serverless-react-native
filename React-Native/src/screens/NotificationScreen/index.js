import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";

import PopupContext from '../../context/Popup/PopupContext';
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import CONSTANTS from '../../common/PeertalConstants';
import { getAllNotifications, readAllNotifications, deleteAllNotifications } from "../../actions/userActions";
import NotificationItem from "./NotificationItem";
import NotificationScreen from './NotificationScreen';

const NotificationScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [isLoading, setIsLoading] = useState(false);
  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    readAllNotifications(props.user.accessToken, res => {
    }, (err) => defaultError(err));
  })

  const onHandleAction = (index) => {
    if (index == 0) {
      deleteAllNotifications(props.user.accessToken, res => {
        _loadData();
      }, (err) => defaultError(err));
    }
  }

  const _loadData = () => {
    setIsLoading(true);
    setNotificationList([]);
    getAllNotifications(
      props.user.accessToken,
      res => {
        setNotificationList(res.data.data.list);
        setIsLoading(false);
      },
      err => {
        alert({ title: "Uh-oh", main: err.response?.data?.message ?? err.message });
        setIsLoading(false);
      }
    );
  }

  const _keyExtractor = (item, index) => {
    return index.toString() + item.id.toString();
  }

  const _renderItem = ({ item }) => {
    return <NotificationItem CONSTANTS={CONSTANTS} data={item} navigation={props.navigation} />;
  }

  return (
    <NotificationScreen
      {...props}
      isLoading={isLoading}
      notificationList={notificationList}
      onHandleAction={onHandleAction}
      _loadData={_loadData}
      _keyExtractor={_keyExtractor}
      _renderItem={_renderItem}
    />
  );
}

const mapStateToProps = store => ({
  user: store.user
});
const NotificationScreenContainerWrapper = connect(mapStateToProps)(NotificationScreenContainer);
export default NotificationScreenContainerWrapper;
