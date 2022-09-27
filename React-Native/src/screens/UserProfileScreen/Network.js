import React from 'react';
import {View} from 'react-native';

import CONSTANTS from '../../common/PeertalConstants';
import {Text} from '../../components/CoreUIComponents';
import PersonRowItem from '../../components/PersonRowItem';

const Network = (props) => {
    const {userData, user, navigation} = props
    let friendsList = userData ? userData.friends : [];
    if (friendsList.length == 0)
        return (
            <Text style={{alignSelf: 'center', margin: 15}}>
                Wow, no friends added yet!!!
            </Text>
        );
    return (
        <View style={{backgroundColor: "#FFFFFF"}}>
            {friendsList.map((item, index) => (
                <PersonRowItem
                    user={user}
                    data={item}
                    key={index}
                    navigation={navigation}
                />
            ))}
        </View>
    );

}

export default Network;