import React from 'react';
import { TouchableOpacity, View, } from 'react-native';
import CONSTANTS from '../../common/PeertalConstants';
import { Text, } from '../../components/CoreUIComponents';

const SkillTags = (props) => {

    const {
        skillList,
        setSkillList
    } = props;

    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 15 }}>
            {skillList.map((item, index) => (
                <View
                    style={{
                        backgroundColor: CONSTANTS.MY_GRAYBG,
                        height: 50,
                        borderRadius: 25,
                        margin: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    key={index}>
                    <Text style={{ fontSize: 14, marginHorizontal: 15 }}>{item} </Text>
                </View>
            ))}
            {skillList.length > 0 ? (
                <TouchableOpacity
                    style={{
                        backgroundColor: CONSTANTS.MY_GRAYBG,
                        height: 50,
                        borderRadius: 25,
                        margin: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => setSkillList([])}>
                    <Text style={{ fontSize: 14, marginHorizontal: 15, color: 'red' }}>
                        Clear all{' '}
                    </Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
}
export default SkillTags;