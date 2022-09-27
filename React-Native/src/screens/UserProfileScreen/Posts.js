import React, {useMemo} from 'react';
import {View} from 'react-native';

import PostItem from '../../components/PostItem';

const Posts = (props) => {
    const {posts, handleLoadingPosts, navigation} = props;

    const postsData = useMemo(() => {
        return posts;
    }, [posts, handleLoadingPosts, navigation])

    if (postsData) {
        return (
            <View>
                {postsData.map((item, index) => {
                    if (props.hiddenPostId.some(id => id == item.id)) return null;
                    return (
                        <PostItem
                            data={item}
                            key={item + index}
                            callback={handleLoadingPosts}
                            navigation={navigation}
                        />
                    )
                })}
            </View>
        );
    } else {
        return <></>;
    }
}

export default Posts;