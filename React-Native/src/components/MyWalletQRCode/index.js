import React, { memo, useContext, useMemo } from 'react';
import Clipboard from '@react-native-community/clipboard';

import CONSTANTS from '../../common/PeertalConstants';
import MyWalletQRCode from './MyWalletQRCode';
import UserContext from '../../context/User/UserContext';

const MyWalletQRCodeContainer = (props) => {
  const { verificationStatus } = useContext(UserContext);

  const identityStatus = useMemo(() => {
    if (verificationStatus === -1) {
      return 'unverified';
    }

    if (verificationStatus === 2) {
      return 'rejected';
    }

    if (verificationStatus === 1) {
      return 'verified';
    }

    if (verificationStatus === 0) {
      return 'verifying';
    }
  }, [verificationStatus]);

  const data = props.data || {};
  const user = props.user;
  const showUp = props.enabled;
  const onClose = props.onClose;
  const avatarUrl = user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
  const walletAddress = data.address;
  const walletName = user.fullName;
  const description =
    'Show this to other people so they can find you on the network';
  const qrImageUrl = CONSTANTS.GENERATE_QR_CODE_API + walletAddress;
  const verifiedDesc = 'Your account is verified';
  const verifyingDesc = 'Verification process is in progress';
  const rejectedDesc = 'Your verification has been rejected';
  const unverifiedDesc = 'Your account has not been verified';
  const unverifiedLink = 'Click here to start verification process';

  return (
    <MyWalletQRCode
      {...props}
      showUp={showUp}
      onClose={onClose}
      avatarUrl={avatarUrl}
      walletAddress={walletAddress}
      walletName={walletName}
      description={description}
      qrImageUrl={qrImageUrl}
      Clipboard={Clipboard}
      verifiedDesc={verifiedDesc}
      verifyingDesc={verifyingDesc}
      unverifiedDesc={unverifiedDesc}
      unverifiedLink={unverifiedLink}
      rejectedDesc={rejectedDesc}
      identityStatus={identityStatus}
    />
  );
};

export default memo(MyWalletQRCodeContainer);
