import React, {useState} from 'react';
import UserContext from './UserContext';

const UserProvider = (props) => {
  const [haveCheckedLocation, setHaveCheckedLocation] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState(-1);

  return (
    <UserContext.Provider
      value={{
        haveCheckedLocation,
        setHaveCheckedLocation,
        verificationStatus,
        setVerificationStatus,
      }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
