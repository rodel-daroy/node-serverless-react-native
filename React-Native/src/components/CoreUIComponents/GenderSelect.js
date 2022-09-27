import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import CONSTANTS from '../../common/PeertalConstants';

export default class GenderSelect extends Component {
  constructor(props) {
    super(props);
    this.state = { genderSelect: 'any', initVal: this.props.initVal };
    this.handleChangeGender = this.handleChangeGender.bind(this);
  }

  handleChangeGender(gender) {
    this.props.onChangeValue(gender);
  }
  render() {
    const gender = this.state.initVal ? 'any' : this.props.value;
    return (
      <View style={{ marginHorizontal: 15, marginTop: 16 }}>
        <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD, ...this.props.titleFontSize }}>
          Gender
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingVertical: 15,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ initVal: false });
              this.handleChangeGender('any');
            }}>
            <View
              style={{
                backgroundColor: CONSTANTS.MY_BLUE,
                width: 50,
                height: 50,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                opacity: gender == 'any' ? 1 : 0.5,
                ...CONSTANTS.SELECT_SHADOW_STYLE
              }}>
              {gender == 'any' ? (
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: 'white',
                    marginTop: -16,
                    marginHorizontal: -8,
                    alignSelf: 'flex-end',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: CONSTANTS.MY_PINK,

                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="check"
                      type="FontAwesome"
                      style={{
                        color: 'white',
                        fontSize: 12,
                      }}></Icon>
                  </View>
                </View>
              ) : null}
              <Icon
                name="appstore1"
                type="AntDesign"
                style={{ color: 'white' }}
              />
            </View>
            <Text
              style={{
                marginTop: 10,
                alignSelf: 'center',
                fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                fontSize: 12,
                opacity: gender == 'any' ? 1 : 0.5,
              }}>
              Any
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ initVal: false });
              this.handleChangeGender('male');
            }}>
            <View
              style={{
                backgroundColor: CONSTANTS.MY_BLUE,
                width: 50,
                height: 50,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                marginLeft: 45,
                opacity: gender == 'male' ? 1 : 0.5,
                ...CONSTANTS.SELECT_SHADOW_STYLE
              }}>
              {gender == 'male' ? (
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: 'white',
                    marginTop: -16,
                    marginHorizontal: -8,
                    alignSelf: 'flex-end',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: CONSTANTS.MY_PINK,

                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="check"
                      type="FontAwesome"
                      style={{
                        color: 'white',
                        fontSize: 12,
                      }}></Icon>
                  </View>
                </View>
              ) : null}
              <Icon name="md-male" style={{ color: 'white' }} />
            </View>
            <Text
              style={{
                marginTop: 10,
                alignSelf: 'center',
                marginLeft: 45,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                fontSize: 12,
                opacity: gender == 'male' ? 1 : 0.5,
              }}>
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ initVal: false });
              this.handleChangeGender('female');
            }}>
            <View
              style={{
                backgroundColor: CONSTANTS.MY_BLUE,
                width: 50,
                height: 50,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                marginLeft: 45,
                opacity: gender == 'female' ? 1 : 0.5,
                ...CONSTANTS.SELECT_SHADOW_STYLE
              }}>
              {gender == 'female' ? (
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: 'white',
                    marginTop: -16,
                    marginHorizontal: -8,
                    alignSelf: 'flex-end',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: CONSTANTS.MY_PINK,

                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="check"
                      type="FontAwesome"
                      style={{
                        color: 'white',
                        fontSize: 12,
                      }}></Icon>
                  </View>
                </View>
              ) : null}
              <Icon name="md-female" style={{ color: 'white' }} />
            </View>
            <Text
              style={{
                marginTop: 10,
                alignSelf: 'center',
                marginLeft: 45,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                fontSize: 12,
                opacity: gender == 'female' ? 1 : 0.5,
              }}>
              Female
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
