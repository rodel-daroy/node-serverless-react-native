import axios from 'axios';
import CONSTANTS from '../common/PeertalConstants';


const HOST = CONSTANTS.SERVER_API + 'post?limit=10';

const requestPosts = () => {
  return { type: 'REQUEST_POSTS' };
};


export const deleteAPost = (
  accessToken,
  postId = -10,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'post/' + postId;
  const postConfig = {
    headers: {
      'access-token': accessToken,
      'Content-Type': 'application/json',
    },
  };
  axios
    .delete(host, postConfig)
    .then((res) => callBackSuccess(res))
    .catch((err) => callBackError(err));
};

export const refreshPosts = (
  callbackError,
  accessToken,
  nsfw,
  eighteenOver,
  sortType = 'TIMELINE',
  longitude = 150,
  latitude = -33,
  distanceKm = 1000,
) => {
  return (dispatch) => {
    dispatch(resetPosts());
    const getConfig = {
      headers: {
        'access-token': accessToken,
        'Content-Type': 'application/json',
      },
    };
    const from = 0;
    let hostServer = HOST + '&from=' + from + '&sorting=' + sortType + '&longitude=' + longitude + '&latitude=' + latitude + '&nsfw=' + !!nsfw + '&eighteenOver=' + !!eighteenOver;
    if (sortType === 'LOCATION') {
      hostServer = HOST + '&from=' + from + '&sorting=' + sortType + '&longitude=' + longitude + '&latitude=' + latitude + '&distanceKm=' + distanceKm + '&nsfw=' + !!nsfw + '&eighteenOver=' + !!eighteenOver;
    }
    return axios.get(hostServer, getConfig)
      .then((response) => {
        return dispatch(receivePosts(response.data.data, sortType));
      })
      .catch((error) => {
        callbackError(error + ' cannot refresh Post');
        return dispatch(stopLoading());
      });
  };
};

export const refreshDiscoverPosts = (
  accessToken,
  nsfw,
  eighteenOver,
  sortType = 'TIMELINE',
  longitude = 150,
  latitude = -33,
  distanceKm = 1000,
) => {
  return (dispatch) => {
    dispatch(resetPosts());
    const getConfig = {
      headers: {
        'access-token': accessToken,
        'Content-Type': 'application/json',
      },
    };
    const from = 0;
    let hostServer = HOST + '&from=' + from + '&sorting=' + sortType + '&longitude=' + longitude + '&latitude=' + latitude + '&nsfw=' + !!nsfw + '&eighteenOver=' + !!eighteenOver;
    if (sortType === 'LOCATION') {
      hostServer = HOST + '&from=' + from + '&sorting=' + sortType + '&longitude=' + longitude + '&latitude=' + latitude + '&distanceKm=' + distanceKm + '&nsfw=' + !!nsfw + '&eighteenOver=' + !!eighteenOver;
    }
    return axios.get(hostServer, getConfig)
      .then((response) => {
        return dispatch(receivePosts(response.data.data, sortType));
      })
      .catch((error) => {
        // return dispatch(stopLoading());
      });
  };
};

const resetPosts = () => {
  return { type: 'RESET_POSTS' };
};

const stopLoading = () => {
  return { type: 'STOP_LOADING_POSTS' };
};

export const fetchPosts = (
  startX = 0,
  accessToken = '',
  nsfw,
  eighteenOver,
  sortType = 'TIMELINE',
  longitude = 150.11,
  latitude = -33.33,
  distanceKm = 10000,
) => {
  return (dispatch) => {
    dispatch(requestPosts());
    const from = startX;
    const getConfig = {
      headers: {
        'access-token': accessToken,
        'Content-Type': 'application/json',
      },
    };
    let hostServer = HOST + '&from=' + from + '&sorting=' + sortType + '&longitude=' + longitude + '&latitude=' + latitude + '&nsfw=' + !!nsfw + '&eighteenOver=' + !!eighteenOver;
    if (sortType === 'LOCATION') {
      hostServer = HOST + '&from=' + from + '&sorting=' + sortType + '&longitude=' + longitude + '&latitude=' + latitude + '&distanceKm=' + distanceKm + '&nsfw=' + !!nsfw + '&eighteenOver=' + !!eighteenOver;
    }
    return axios.get(hostServer, getConfig)
      .then((response) => {
        return dispatch(receivePosts(response.data.data, sortType));
      })
      .catch((error) => {
        alert(error + 'cannot fetch Post 1');
        return dispatch(stopLoading());
      });
  };
};

export const fetchDiscoverPosts = (
  startX = 0,
  accessToken = '',
  nsfw,
  eighteenOver,
  sortType = 'TIMELINE',
  longitude = 150.11,
  latitude = -33.33,
  distanceKm = 10000,
) => {
  return (dispatch) => {
    dispatch(requestPosts());
    const from = startX;
    const getConfig = {
      headers: {
        'access-token': accessToken,
        'Content-Type': 'application/json',
      },
    };
    let hostServer =
      HOST +
      '&from=' +
      from +
      '&sorting=' +
      sortType +
      '&longitude=' +
      longitude +
      '&latitude=' +
      latitude +
      '&nsfw=' + !!nsfw +
      '&eighteenOver=' + !!eighteenOver;
    if (sortType === 'LOCATION') {
      hostServer =
        HOST +
        '&from=' +
        from +
        '&sorting=' +
        sortType +
        '&longitude=' +
        longitude +
        '&latitude=' +
        latitude +
        '&distanceKm=' +
        distanceKm +
        '&nsfw=' + !!nsfw +
        '&eighteenOver=' + !!eighteenOver;
    }
    return axios
      .get(hostServer, getConfig)
      .then((response) => {
        return dispatch(receivePosts(response.data.data, sortType));
      })
      .catch((error) => {
        // alert(error + "cannot fetch Post 1");
        // return dispatch(stopLoading());
      });
  };
};

export const receivePosts = (data, sortType) => {
  return { type: 'RECEIVE_POSTS', data: data.posts, sortType: sortType };
};

export const getPostsInProfile = (
  accessToken,
  nsfw,
  eighteenOver,
  limit = 10,
  from = 0,
  user_id,
  callbackSuccess,
  callbackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  let host = CONSTANTS.SERVER_API + 'post?userId=' + user_id + '&nsfw=' + !!nsfw + '&eighteenOver=' + !!eighteenOver;
  const getConfig = {
    headers: {
      'access-token': accessToken,
      'Content-Type': 'application/json',
    },
  };
  axios
    .get(host, getConfig)
    .then((res) => callbackSuccess(res))
    .catch((err) => callbackError(err));
};

export const getNearbyPosts = (
  accessToken,
  nsfw,
  eighteenOver,
  keyword = '',
  from = 0,
  limit = 20,
  longitude,
  latitude,
  distanceKm,
  sorting = 'LOCATION',
  callbackSuccess,
  callbackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  let host = CONSTANTS.SERVER_API + 'post?q=' + keyword + '&from=' + from + '&limit=' + limit + '&longitude=' + longitude + '&latitude=' + latitude + '&distanceKm=' + distanceKm + '&sorting=' + sorting + '&nsfw=' + !!nsfw + '&eighteenOver=' + !!eighteenOver;
  const getConfig = {
    headers: {
      'access-token': accessToken,
      'Content-Type': 'application/json',
    },
  };
  axios
    .get(host, getConfig)
    .then((res) => callbackSuccess(res))
    .catch((err) => callbackError(err));
};

export const getPostDetails = (
  accessToken,
  postId,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'post/' + postId;
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .get(host, postConfig)
    .then((res) => callBackSuccess(res))
    .catch((err) => callBackError(err));
};

export const getHashTagPosts = (
  startX = 0,
  accessToken,
  nsfw,
  eighteenOver,
  hashTags = '',
  callbackSuccess,
  callbackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const from = startX;
  let host = CONSTANTS.SERVER_API + 'post?hashTags=' + hashTags + '&from=' + from + '&nsfw=' + !!nsfw + '&eighteenOver=' + !!eighteenOver;
  const getConfig = {
    headers: {
      'access-token': accessToken,
      'Content-Type': 'application/json',
    },
  };
  axios.get(host, getConfig)
    .then((res) => callbackSuccess(res))
    .catch((err) => callbackError(err));
};

export const getSearchPosts = (
  accessToken,
  nsfw,
  eighteenOver,
  keyword = '',
  from = 0,
  limit = 20,
  longitude,
  latitude,
  distanceKm,
  sorting = 'LOCATION',
  callbackSuccess,
  callbackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  let host = CONSTANTS.SERVER_API + 'post?q=' + keyword + '&from=' + from + '&limit=' + limit + '&longitude=' + longitude + '&latitude=' + latitude + '&distanceKm=' + distanceKm + '&sorting=' + sorting + '&nsfw=' + !!nsfw + '&eighteenOver=' + !!eighteenOver;
  const getConfig = {
    headers: {
      'access-token': accessToken,
      'Content-Type': 'application/json',
    },
  };
  axios.get(host, getConfig)
    .then((res) => callbackSuccess(res))
    .catch((err) => callbackError(err));
};

export const deleteComment = (
  accessToken,
  commentId,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'comment/' + commentId;
  let apiData = {};
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios.delete(host, postConfig)
    .then((res) => callBackSuccess(res))
    .catch((err) => callBackError(err));
};

export const editComment = (
  accessToken,
  commentData = {
    content: 'test content',
    objectId: 390,
    objectType: 'POST',
    parentCommentId: 0,
    isIncognito: false,
  },
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  const postData = commentData;
  axios.put(CONSTANTS.SERVER_API + 'comment', postData, postConfig)
    .then((res) => {
      callBackSuccess(res);
    })
    .catch((err) => {
      callBackError(err);
    });
};

export const getPostRewards = (
  accessToken,
  postId,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'post-rewards/' + postId;
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .get(host, postConfig)
    .then((res) => {
      callBackSuccess(res);
    })
    .catch((err) => {
      callBackError(err);
    });
};
