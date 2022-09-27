import React, { useState } from 'react';
import CONSTANTS from '../../../common/PeertalConstants';
import { goToProfile } from '../../../actions/userActions';
import ScanQRCodeModal from './ScanQRCodeModal';

const ScanQRCodeModalContainer = (props) => {

  const [myCodeTab, setMyCodeTab] = useState(true);
  const [QRData, setQRData] = useState('');

  const _setTab = (value) => {
    setMyCodeTab(value);
  }

  const getMyCodeTabName = () => {
    const fullName = props.QRCodeUserName;
    const index = fullName.indexOf(' ');
    const firstName = index == -1 ? fullName : fullName.substring(0, index);
    const myCodeTabName =
      firstName.length < 8 ? firstName + `'s Code` : 'User QR Code';
    return myCodeTabName;
  }

  const onSuccess = (e) => {
    setQRData(e.data.length > 30 ? e.data.substring(0, 30) + '...' : e.data);
    if (e.data.substring(0, 18) == `www.kuky.com/user/`) {
      goToProfile(props.navigation, e.data.substring(18));
      props.onClose();
      setQRData('');
      setMyCodeTab(true);
    }
  }

  const showUp = props.enabled;
  const onClose = props.onClose;
  const description = `show this to other people so they can find
      ${props.QRCodeUserName} on the network`;
  const userAddress = 'www.kuky.com/user/' + props.QRCodeUserId;
  const qrImageUrl = CONSTANTS.GENERATE_QR_CODE_API + userAddress;

  return (
    <ScanQRCodeModal
      {...props}
      myCodeTab={myCodeTab}
      _setTab={_setTab}
      getMyCodeTabName={getMyCodeTabName}
      onSuccess={onSuccess}
      showUp={showUp}
      onClose={onClose}
      description={description}
      qrImageUrl={qrImageUrl}
    />
  );
}

export default ScanQRCodeModalContainer;