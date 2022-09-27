import React, { Component } from 'react'
import { View, Text } from 'react-native'
import PostItem from '../components/PostItem';
import { Content } from 'native-base';
import { fetchPost } from '../actions/postActions';
import { connect } from 'react-redux';
import { FlatList, TouchableWithoutFeedback } from 'react-native';

class Tab1 extends Component {
    constructor(props) {
        super(props);
        this.loadingPost = this.loadingPost.bind(this);
    }
    _keyExtractor = (item, index) => {
        const x = item.id.toString() + index.toString();
        return x;
    };
    _renderItem = ({ item }) => (
        <PostItem

            id={item.id}
            data={item}
        />
    );
    componentDidMount() {
        this.loadingPost(0);
    }
    loadingPost() {
        this.props.dispatch(fetchPost(this.props.posts.length));
    }


    render() {
        const { posts, postLen, isLoading } = this.props;
        if (isLoading)
            return (<Content>
                <FlatList
                    data={posts}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}

                />
                <Text>Loading</Text>
            </Content>)
        return (
            <FlatList
                data={posts}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}

            />
        )
    }
}
const mapStateToProps = (store) => ({ posts: store.posts.posts, postLen: store.posts.postLen, isLoading: store.posts.isLoading })
const TimeLineTab = connect(mapStateToProps)(Tab1);
export default TimeLineTab;