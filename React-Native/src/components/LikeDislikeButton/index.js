import React, { useState } from 'react';

import LikeDislikeButton from './LikeDislikeButton';

const LikeDislikeButtonContainer = (props) => {

        const type = props.type || 'like';
        const active = props.active || false;
        const onPress = props.onPress;
        let sourceIcon;
        if (type == 'like' && active) sourceIcon = require('../../assets/xd/Icons/active_arrow_up.png');
        if (type == 'like' && !active) sourceIcon = require('../../assets/xd/Icons/inactive_arrow_up.png');
        if (type == 'dislike' && active) sourceIcon = require('../../assets/xd/Icons/active_arrow_down.png');
        if (type == 'dislike' && !active) sourceIcon = require('../../assets/xd/Icons/inactive_arrow_down.png');
        if (type == 'comment') sourceIcon = require('../../assets/xd/Icons/comment_icon.png');
        if (type == 'share') sourceIcon = require('../../assets/xd/Icons/share_icon.png');
        const onTouch = () => { onPress ? onPress() : null; }
        return (
            <LikeDislikeButton 
            {...props}
            onTouch={onTouch}
            sourceIcon={sourceIcon}
            />
        )
    }


export default LikeDislikeButtonContainer;