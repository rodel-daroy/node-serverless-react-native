import { Icon } from 'native-base';
import React from 'react';
import { Image, TouchableOpacity, View, } from 'react-native';
import CONSTANTS from '../../common/PeertalConstants';
import { Text, } from '../../components/CoreUIComponents';

const PersonalityItem = (props) => {

    const {
        item,
        index,
        selectedCharacter,
        setSelectedCharacter,
    } = props;

    return (
        <View
            style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 15,
                paddingVertical: 20,
            }}>
            <View
                style={{ elevation: CONSTANTS.OS === 'android' ? 50 : 0, zIndex: 3 }}>
                <Image
                    source={item.app_image_src}
                    style={{
                        width: 180 * CONSTANTS.WIDTH_RATIO,
                        height: 180 * CONSTANTS.WIDTH_RATIO,
                    }}></Image>
            </View>
            <View
                style={{
                    elevation: CONSTANTS.OS === 'android' ? 50 : 0,
                    zIndex: 4,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor:
                        selectedCharacter !== index
                            ? '#DEDEDE'
                            : CONSTANTS.MY_PINK,
                    marginTop: -75,
                    alignSelf: 'flex-end',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Icon
                    name="check"
                    type="FontAwesome"
                    style={{
                        color:
                            selectedCharacter == index ? 'white' : '#DEDEDE',
                        fontSize: 14,
                    }}></Icon>
            </View>
            <View
                style={{
                    backgroundColor: 'white',
                    ...CONSTANTS.MY_SHADOW_STYLE,
                    alignItems: 'center',
                    marginHorizontal: 15,
                    borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
                    elevation: CONSTANTS.OS === 'android' ? 7 : 0,
                    marginTop: -15,
                    zIndex: 1,
                    paddingHorizontal: 15,
                    width: CONSTANTS.OS === 'android' ? null : 256,
                }}>
                <Text
                    style={{
                        marginTop: 75,
                        fontSize: 18,
                        fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                        color: CONSTANTS.MY_BLUE,
                        marginHorizontal: 15,
                    }}>
                    {item.name}
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        marginHorizontal: 15,
                        marginVertical: 20,
                        textAlign: 'center',
                    }}>
                    {item.summary}
                </Text>

                <TouchableOpacity
                    onPress={() => {
                        setSelectedCharacter(index)
                    }}
                    style={{
                        width: 180,
                        height: 50,
                        borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
                        backgroundColor: CONSTANTS.MY_BLUE,
                        marginBottom: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 14,
                            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                        }}>
                        Select
    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default PersonalityItem;