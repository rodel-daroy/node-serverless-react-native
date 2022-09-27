import React, { useEffect, useState, useCallback } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, BackHandler } from 'react-native';
import { css } from '@emotion/native';
import Modal from 'react-native-modal';

import PopupContext from './PopupContext';
import CONSTANTS from '../../common/PeertalConstants';

const PopupProvider = (props) => {

  const [popup, setPopup] = useState("");
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (popup === '') {
      setVisible(false);
      return;
    }
    if (typeof popup === 'string' && popup !== '') setVisible(true);
    if (typeof popup === 'object' && popup.title && popup.main) setVisible(true);
    if (typeof popup === 'object' && popup.title && popup.custom) setVisible(true);
  }, [popup])

  const clearPopup = () => {
    setPopup("");
  }

  const renderTitle = () => {
    if (typeof popup === 'string' && popup !== '') {
      return (
        <View
          style={{
            width: '100%',
            height: 60,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#D1D3D4',
          }}
        >
          <Text style={{
            color: "#414042",
            fontSize: 18,
            fontWeight: "bold",
          }}>
            Uh-oh
          </Text>
        </View>
      );
    }
    if (typeof popup === 'object' && popup.title && popup.main) {
      return (
        <View
          style={{
            width: '100%',
            height: 60,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#D1D3D4'
          }}
        >
          <Text style={{
            color: "#414042",
            fontSize: 18,
            fontWeight: "bold",
          }}>
            {popup.title}
          </Text>
        </View>
      );
    }
    if (typeof popup === 'object' && popup.title && popup.custom) {
      return (
        <View
          style={{
            width: '100%',
            height: 60,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#D1D3D4'
          }}
        >
          <Text style={{
            color: "#414042",
            fontSize: 18,
            fontWeight: "bold",
          }}>
            {popup.title}
          </Text>
        </View>
      );
    }
  }

  const renderDescription = () => {
    if (typeof popup === 'string' && popup !== '') {
      return (
        <>
          <View style={Styles.descriptionContainer}>
            <Text style={{
              color: "#414042",
              fontSize: 14,
            }}>{popup}</Text>
          </View>
          {renderButton()}
        </>
      );
    }
    if (typeof popup === 'object' && popup.title && popup.main) {
      return (
        <>
          <View style={Styles.descriptionContainer}>
            <Text style={{
              color: "#414042",
              fontSize: 14,
            }}>{popup.main}</Text>
          </View>
          {renderButton()}
        </>
      );
    }
    if (typeof popup === 'object' && popup.title && popup.custom) {
      return (
        <>
          <View style={Styles.descriptionContainer}>
            {popup.custom}
          </View>
          {renderButton()}
        </>
      );
    }
  }

  const renderButton = () => {
    if (typeof popup === 'string' && popup !== '') {
      return (
        <View style={Styles.buttonContainer}>
          <TouchableOpacity onPress={() => { clearPopup(); }}>
            <View style={Styles.button}>
              <Text style={Styles.buttonText}>Close</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    if (typeof popup === 'object' && popup.title && popup.main && !popup.button) {
      return (
        <View style={Styles.buttonContainer}>
          <TouchableOpacity onPress={() => { clearPopup(); }}>
            <View style={Styles.button}>
              <Text style={Styles.buttonText}>Close</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    if (typeof popup === 'object' && popup.title && popup.main && popup.button) {
      return (
        <View style={Styles.buttonContainer}>
          {popup.button.map((item, index) => {
            return <TouchableOpacity key={index} onPress={() => { item.onPress ? item.onPress() : clearPopup(); }}>
              <View style={buttonStyle(item.style || 'default')}>
                <Text style={buttonTextStyle(item.style || 'default')}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          })}
        </View>
      )
    }
  }

  return (
    <>
      <PopupContext.Provider value={{
        popup, setPopup
      }}
      >
        {props.children}
        <Modal
          isVisible={visible}
          backdropOpacity={0.15}
        >
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              shadowColor: '#BCBEC0',
              shadowOffset: { width: 10, height: 10 },
              shadowOpacity: 0.9,
              shadowRadius: 20,
              elevation: 1,
            }}>
            <View
              style={{
                width: '90%',
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
                borderColor: 'rgba(0, 0, 0, 0.1)',
              }}>
              {renderTitle()}
              {renderDescription()}
            </View>
          </View>
        </Modal>
      </PopupContext.Provider>

    </>
  );
};

export default PopupProvider;

const Styles = StyleSheet.create({
  descriptionContainer: {
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingTop: 40,
    paddingBottom: 25,
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
    padding: 20
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: CONSTANTS.MY_CANCEL_BG_COLOR,
    minWidth: 80,
    minHeight: 50,
    borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: CONSTANTS.MY_CANCEL_BORDER_COLOR
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#0477FF",
    minWidth: 80,
    minHeight: 50,
    borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#414042",
    fontSize: 15,
    fontWeight: '700'
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: '700'
  }
});

const buttonStyle = (type) => css`
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 20px;
    padding-left: 20px;
    background-color: #0477FF;
    min-width: 80px;
    min-height: 50px;
    border-radius: ${CONSTANTS.CARD_BORDER_RADIUS + 'px'};
    justify-content: center;
    align-items: center;

    ${type === 'cancel' && css`
      background-color: ${CONSTANTS.MY_CANCEL_BG_COLOR};
      border-width: 1px;
      border-color: ${CONSTANTS.MY_CANCEL_BORDER_COLOR};
    `};

    ${type === 'small' && css`
      padding-right: 10px;
      padding-left: 10px;
      max-width: 80px;
    `};

    ${type === 'smallCancel' && css`
      background-color: ${CONSTANTS.MY_CANCEL_BG_COLOR};
      border-width: 1px;
      border-color: ${CONSTANTS.MY_CANCEL_BORDER_COLOR};
      padding-right: 10px;
      padding-left: 10px;
      max-width: 80px;
    `};
`;

const buttonTextStyle = (type) => css`
    color: #FFFFFF;
    font-size: 15px;
    font-weight: 700;

    ${type === 'cancel' && css`
      color: #414042;
    `};

    ${type === 'smallCancel' && css`
      color: #414042;
      font-size: 13px;
    `};

    ${type === 'small' && css`
      font-size: 13px;
    `};
`;