import React, { useMemo, useContext } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { NavigationEvents } from 'react-navigation';

import PostsContext from '../../context/Posts/PostsContext';
import CONSTANTS from '../../common/PeertalConstants';
import { DiscoverLoading } from '../../components/CoreUIComponents';
import Footer from '../../components/Footer';
import SearchBar from '../../components/SearchBar';
import DiscoverNav from './DiscoverNav';


const DiscoverScreen = (props) => {
    const {createdPost} = useContext(PostsContext);

    const postsDataIncludingJustCreatedPost = useMemo(() => {
        if (createdPost.length > 0) {
            if (props.posts.some(post => post.id === createdPost[0].id)) {
                return props.posts;
            } else {
                return [...createdPost, ...props.posts];
            }
        }

        return props.posts;
    }, [props.posts, createdPost]);

    const rawPostsData = useMemo(() => {
        if (createdPost.length > 0) {
            return postsDataIncludingJustCreatedPost;
        }

        return props.posts;
    }, [postsDataIncludingJustCreatedPost, props.posts, createdPost]);

    const postsData = useMemo(() => {
        const postData = rawPostsData.reduce((acc, cur, i) => {
            if (i === 0) {
                return [acc];
            } else {
                return acc.some(item => item.id === cur.id) ? [...acc] : [...acc, cur];
            }
        }, rawPostsData[0])

        return postData;
    }, [rawPostsData]);

    if (props.isMounted) {
        return (
            <View style={{flexDirection: 'column', flex: 1}}>
                <NavigationEvents onWillFocus={props._onShow}/>
                <View
                    style={{
                        flex: 100 + CONSTANTS.SPARE_HEADER,
                        flexDirection: 'column',
                        height: 120,
                        backgroundColor: 'white',
                        marginTop: 8,
                    }}>
                    {/* <StatusBar /> */}
                    <View style={{flexDirection: 'row', marginTop: CONSTANTS.SPARE_HEADER}}>
                        <TouchableOpacity
                            accessibilityLabel="user-avatar"
                            onPress={() => props.navigation.toggleDrawer()}>
                            <Image
                                source={{uri: props.user.avatarUrl}}
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 17,
                                    marginLeft: 10,
                                }}
                            />
                        </TouchableOpacity>
                        <SearchBar navigation={props.navigation}/>
                    </View>
                    <DiscoverNav
                        user={props.user}
                        sortType={props.sortType}
                        dispatch={props.dispatch}
                        setPopup={props.setPopup}
                        defaultError={props.defaultError}
                    />
                </View>
                <View
                    style={{flex: CONSTANTS.HEIGHT - 55 - 100 - CONSTANTS.SPARE_FOOTER - CONSTANTS.SPARE_HEADER}}>
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        onRefresh={props.handleRefreshTimeLine}
                        refreshing={props.isLoading && props.posts.length == 0}
                        data={postsData}
                        initialNumToRender={10}
                        keyExtractor={props._keyExtractor}
                        renderItem={props._renderItem}
                        onEndReached={props.handleLoadMore}
                        onEndReachedThreshold={0.8}
                        ListFooterComponent={() =>
                            props.isLoading && props.posts.length === 0 ?
                                <DiscoverLoading isAutoRun={true}/>
                                :
                                null
                        }
                        ListHeaderComponent={props._renderHeader}
                    />
                </View>
                {CONSTANTS.OS === 'android' ?
                    null
                    :
                    <KeyboardSpacer topSpacing={-50}/>
                }
                <View style={{flex: 55 + CONSTANTS.SPARE_FOOTER}}>
                    <Footer {...props} />
                </View>
            </View>
        );
    } else {
        return null;
    }
};

export default DiscoverScreen;
