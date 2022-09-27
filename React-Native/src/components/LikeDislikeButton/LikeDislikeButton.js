import React from 'react';
import { TouchableOpacity, Image, View } from 'react-native';

const LikeDislikeButton = (props) => {

    const {
        onTouch,
        sourceIcon
    } = props;

    return (
        <TouchableOpacity {...props} onPress={onTouch}>
            <View>
                <Image source={sourceIcon} />
            </View>
        </TouchableOpacity>
    )
}

export default LikeDislikeButton;