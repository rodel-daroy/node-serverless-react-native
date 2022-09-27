import React from 'react';
import { Icon } from 'native-base';
import {
  View,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Text } from './CoreUIComponents';
import CONSTANTS from '../common/PeertalConstants';


const SelectCountryModal = (props) => {

  return (
    <Modal animationType="slide" transparent={false} visible={props.enabled}>
      <View style={{ flexDirection: 'column', height: '100%' }}>
        <View
          style={{
            height: 48,
            marginTop: CONSTANTS.SPARE_HEADER,
            alignItems: 'center',
            ...CONSTANTS.TOP_SHADOW_STYLE,
            borderBottomWidth: 1,
            borderBottomColor: CONSTANTS.MY_GREY,
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={() => props.onClose()}>
            <Icon
              name="arrowleft"
              type="AntDesign"
              style={{ marginLeft: 15 }}
            />
          </TouchableOpacity>
          <View
            style={{
              marginLeft: 0,
              width: CONSTANTS.WIDTH - 15 - 30 - 30,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                color: '#414042',
              }}>
              Select One
              </Text>
          </View>
        </View>


        {props.listCountries.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                paddingHorizontal: 14
              }}>
              <TouchableOpacity
                onPress={() => { 
                  props.setCountry(item.country);
                  props.setCurrentCode(item.phoneCode);
                  props.onClose();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: 50,
                  width: '100%',
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(0,0,0,0.2)',
                }}>
                <View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    marginLeft: 10,
                    color: item.country == props.country ? CONSTANTS.MY_BLUE: CONSTANTS.MY_GRAY
                  }}>{item.country}</Text>
                </View>
                <View>
                  <Icon
                    name="check"
                    type="FontAwesome"
                    style={{
                      fontSize: 14,
                      fontWeight: '100',
                      marginRight: 10,
                      color: item.country == props.country ? CONSTANTS.MY_BLUE: "rgba(255,255,255,0)"
                    }} />
                </View>
              </TouchableOpacity>
            </View>
          );
        })
        }

      </View>
    </Modal>
  );
}

export default SelectCountryModal;