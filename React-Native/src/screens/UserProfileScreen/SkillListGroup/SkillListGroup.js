import React from 'react';
import {View, TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {Text} from '../../../components/CoreUIComponents';
import CONSTANTS from '../../../common/PeertalConstants';

const SkillListGroup = (props) => {

    const {
        skillValue,
        setSkillValue,
        addSkillAction,
        renderItems,
    } = props;

    return (
        <View style={{marginTop: 15, ...props.style}}>
            <View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    height: 40,
                    borderRadius: 20,
                    alignItems: 'center',
                }}>
                <TextInput
                    style={{
                        width: CONSTANTS.WIDTH - 100 - 30,
                        backgroundColor: CONSTANTS.MY_GRAYBG,
                        fontSize: 14,
                        color: CONSTANTS.MY_GREY,
                        height: 40,
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        paddingLeft: 15,
                    }}
                    value={skillValue}
                    placeholder="Add strengths"
                    onChangeText={value => setSkillValue(value)}
                />
                <TouchableOpacity
                    onPress={addSkillAction}
                    style={{
                        backgroundColor: CONSTANTS.MY_BLUE,
                        width: 100,
                        padding: 5,
                        height: 40,
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text
                        style={{
                            color: 'white',
                            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                        }}>
                        Add skill
                    </Text>
                </TouchableOpacity>
            </View>
            {renderItems}
        </View>
    );
}

export default SkillListGroup;