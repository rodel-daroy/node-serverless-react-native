import React, { useState } from 'react';
import PostsContext from './PostsContext';

const PostsProvider = (props) => {
    const [hiddenPostId, setHiddenPostId] = useState([]);
    const [hiddenCommentId, setHiddenCommentId] = useState([]);
    const [createdPost, setCreatedPost] = useState([]);
    const [updatedPost, setUpdatedPost] = useState([]);
    return (
        <PostsContext.Provider value={{
            hiddenPostId,
            setHiddenPostId,
            hiddenCommentId,
            setHiddenCommentId,
            createdPost,
            setCreatedPost,
            updatedPost,
            setUpdatedPost,
        }}
        >
            {props.children}
        </PostsContext.Provider>
    );
};

export default PostsProvider;
