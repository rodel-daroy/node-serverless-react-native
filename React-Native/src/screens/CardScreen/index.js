import React, { memo, useState, useContext } from "react";
import { connect } from "react-redux";

import PopupContext from '../../context/Popup/PopupContext';
import { deleteACard, deletePaymentMethod } from "../../actions/userActions";
import CardScreen from './CardScreen';

const CardScreenContainer = (props) => {

  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [isLoading, setIsLoading] = useState(false);

  const cardData = props.navigation.getParam("data", {});
  const cardLogo = props.navigation.getParam("cardLogo");

  const deleteBank = () => {
    setIsLoading(true);
    alert("");
    deletePaymentMethod(
      props.user.accessToken,
      cardData.id,
      res => {
        setIsLoading(false);
        alert({
          title: 'Delete', main: "Your card has been deleted", button: [
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
        alert("Error with deleting a card : " + err.response.data.message);
        setIsLoading(false);
      }
    );

        /* deleteACard(
      props.user.accessToken,
      cardData.id,
      res => {
        setIsLoading(false);
        alert({
          title: 'Delete', main: "Your card has been deleted", button: [
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
        alert("Error with deleting a card : " + err.response.data.message);
        setIsLoading(false);
      }
    ); */
  }

  return (
    <CardScreen
      {...props}
      cardData={cardData}
      isLoading={isLoading}
      deleteBank={deleteBank}
      alert={alert}
      cardLogo={cardLogo}
    />
  );
}

const mapStateToProps = store => ({
  user: store.user
});
const CardScreenContainerWrapper = connect(mapStateToProps)(CardScreenContainer);
export default memo(CardScreenContainerWrapper);