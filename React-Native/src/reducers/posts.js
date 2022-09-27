const posts = (
  state = { posts: [], postsLen: 0, isLoading: false, sortType: 'TIMELINE' },
  action,
) => {

  switch (action.type) {
    case 'SELECT_SORT_TYPE':
      return { ...state, sortType: action.data.sortType };
    case 'RESET_POSTS':
      return { ...state, posts: [], postsLen: 0, isLoading: true };
    case 'STOP_LOADING_POSTS':
      return { ...state, isLoading: false };
    case 'REQUEST_POSTS':
      return { ...state, isLoading: true };
    case 'UPDATE_COMMENTS_ONE_POST': {
      return {
        ...state,
        posts: state.posts.map((item) => {
          if (item.id !== action.data.post.id) {
            return item;
          }
          return { ...item, ...action.data.post };
        }),
      };
    }
    case 'UPDATE_VOTEDATA_ONE_POST':
      return {
        ...state,
        posts: state.posts.map((item) => {
          if (item.id == action.data.postId) {
            return {
              ...item,
              voteData: { VOTE_LIKE_POST: action.data.VOTE_LIKE_POST },
            };
          } else {
            return item;
          }
        }),
      };

    case 'RECEIVE_POSTS': {
      if (action.sortType === state.sortType) {
        return {
          ...state,
          posts: state.posts.concat(action.data),
          isLoading: false,
          postsLen: state.posts.concat(action.data).length,
        };
      } else {
        return { ...state };
      }
    }
    default:
      return state;
  }
};
export default posts;
