import React, { memo, useState, useContext } from "react";
import { connect } from "react-redux";

import PopupContext from '../../context/Popup/PopupContext';
import { deleteBankAccount } from "../../actions/userActions";
import BankAccountScreen from './BankAccountScreen';

const BankAccountScreenContainer = (props) => {

  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [isLoading, setIsLoading] = useState(false);

  const accountData = props.navigation.getParam("data", {});

  const deleteBank = (id) => {
    setIsLoading(true);
    deleteBankAccount(
      props.user.accessToken,
      id,
      res => {
        setIsLoading(false);
        alert({
          title: 'Delete', main: "Your account has been deleted", button: [
            {
              text: 'OK',
              onPress: () => {
                alert("");
                props.navigation.goBack();
              },
            }
          ],
        })
      },
      err => {
        alert("Error with deleting a bank account : " + err.response.data.message);
        setIsLoading(false);
      }
    );
  }

  return (
    <BankAccountScreen
      {...props}
      accountData={accountData}
      isLoading={isLoading}
      deleteBank={deleteBank}
      alert={alert}
    />
  );
}

const mapStateToProps = store => ({
  user: store.user
});
const BankAccountScreenContainerWrapper = connect(mapStateToProps)(BankAccountScreenContainer);
export default memo(BankAccountScreenContainerWrapper);