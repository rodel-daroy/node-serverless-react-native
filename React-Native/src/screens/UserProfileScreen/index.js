import React, {useState, useContext, useEffect} from 'react';
import SendBird from 'sendbird';
import {connect} from 'react-redux';

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import {getUserProfile} from '../../actions/peopleActions';
import {getPostsInProfile} from '../../actions/postActions';
import {reportToPerson, blockToPerson} from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';
import {LoadingSpinner} from '../../components/CoreUIComponents';
import UserProfileObject from '../../models/UserProfileObject';
import IncognitoProfileObject from '../../models/IncognitoProfileObject';
import {create1to1GroupChannel} from '../../actions/chatActions';
import PostsContext from '../../context/Posts/PostsContext';
import About from './About';
import CognitoAbout from './CognitoAbout';
import Network from './Network';
import Posts from './Posts';
import UserProfileScreen from './UserProfileScreen';

const UserProfileScreenContainer = (props) => {
    const {hiddenPostId, setHiddenPostId} = useContext(PostsContext);
    const {setPopup} = useContext(PopupContext);
    const alert = setPopup;
    const {defaultError} = useContext(DefaultErrorContext);

    const [defaultTab, setDefaultTab] = useState('Posts');
    const [isLoading, setIsLoading] = useState(false);
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState();
    const [userData, setUserData] = useState(new UserProfileObject());
    const [isScanQRModal, setIsScanQRModal] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [sb, setSb] = useState(new SendBird({appId: CONSTANTS.SEND_BIRD.APP_ID}));

    useEffect(() => {
        if (props.navigation.getParam('userId') != -999) {
            const userIdData =
                props.navigation.getParam('userId') || props.user.userId;
            if (userIdData == props.user.userId) setIsOwner(true);
            setIsLoading(true)
            setUserId(userIdData);

            getUserProfile(props.user.accessToken, userIdData, res => {
                setUserData(res.data.data.user_data);
                setIsLoading(false);
            }, err => defaultError(err));
        }
    }, [defaultTab])

    const create1To1Chat = (list) => {
        if (list.length < 1) return;
        let user = props.user;
        let friend = list[0];
        let userList = [JSON.stringify(user.userId), friend.id.toString()];
        create1to1GroupChannel(
            sb,
            userList,
            channel => {
                props.navigation.navigate('MainChat', {
                    sb: sb,
                    channel: channel,
                    user: {
                        _id: JSON.stringify(user.userId),
                        avatar: user.avatarUrl,
                        name: user.fullName,
                    },
                    header: friend,
                    channelUrl: channel.url,
                });
            },
            error => alert('error at creating channel'),
        );
    }

    const _handleReport = () => {
        reportToPerson(
            props.user.accessToken,
            {id: userData.id, type: 'USER', type: 'report'},
            res => {
                alert('Reported successfully');
            },
            err => {
                alert(err.response?.data?.message ?? 'Error when reporting person');
            },
        );
    }

    const _handleSkillReport = () => {
        reportToPerson(
            props.user.accessToken,
            {id: userData.id, type: 'USER', type: 'nsfw'},
            res => {
                alert(
                    `${userData.fullName
                    }'s skill has been successfully reported.`,
                );
            },
            err => {
                alert(err.response?.data?.message ?? 'Error when reporting skill')
            },
        );
    }

    const _handleBlock = () => {
        blockToPerson(
            props.user.accessToken,
            {id: userData.id, type: 'USER', type: 'block'},
            res => {
                alert('Blocked successfully');
            },
            err => {
                alert(err.response?.data?.message ?? 'Error when reporting person')
            },
        );
    }

    const handleTouchTab = (name) => {
        setDefaultTab(name);
    }

    const handleLoadingPosts = () => {
        setIsLoading(true);
        getPostsInProfile(
            props.user.accessToken,
            props.user.loggedStatus === "logged" ? props.user.subscribeToAdultContent : false,
            props.user.loggedStatus === "logged" ? props.user.over18 : false,
            100,
            0,
            props.navigation.getParam('userId') == -999
                ? props.navigation.getParam('userId')
                : userId,
            res => {
                let postsData =
                    props.navigation.getParam('userId') == -999
                        ? res.data.data.posts.filter(item => item.isIncognito == 1)
                        : res.data.data.posts;
                setIsLoading(false);
                setPosts(postsData);
            },
            err => {
                alert(err.response?.data?.message ?? 'Error')
                setIsLoading(false)
            },
        );
    }

    const handleLoadingData = () => {
        setIsOverlayLoading(true);
        if (props.navigation.getParam('userId') == -999) {
            setUserData(new IncognitoProfileObject());
            setIsOverlayLoading(false);
            return;
        }
        const userIdData =
            props.navigation.getParam('userId') || props.user.userId;
        if (userIdData == props.user.userId) setIsOwner(true);
        setUserId(userIdData);

        getUserProfile(props.user.accessToken, userIdData, res => {
            setUserData(res.data.data.user_data);
            setIsOverlayLoading(false);
        }, err => {
            defaultError(err);
            setIsOverlayLoading(false);
        });
    }

    useEffect(() => {
        userId && handleLoadingPosts();
    }, [userId]);

    const handleLoadingDataAtAbout = () => {
        if (props.navigation.getParam('userId') == -999) {
            setUserData(new IncognitoProfileObject());
            return;
        }
        const userIdData =
            props.navigation.getParam('userId') || props.user.userId;
        if (userIdData == props.user.userId) setIsOwner(true);
        setUserId(userIdData);

        getUserProfile(props.user.accessToken, userIdData, res => {
            setUserData(res.data.data.user_data);
        }, err => {
            defaultError(err);
        });
    }

    const _renderAbout = () => (props.navigation.getParam('userId') == -999) ?
        <CognitoAbout/> :
        <About
            user={props.user}
            navigation={props.navigation}
            userData={userData}
            userId={userId}
            handleLoadingData={handleLoadingDataAtAbout}
            _handleSkillReport={_handleSkillReport}
        />

    const _renderNetwork = () => isLoading ?
        <LoadingSpinner/> :
        <Network userData={userData} user={props.user} navigation={props.navigation}/>

    const _renderPosts = () => {
        if (isLoading) return <LoadingSpinner/>;
        if (posts == null) return null;
        return <Posts hiddenPostId={hiddenPostId} posts={posts} handleLoadingPosts={handleLoadingPosts}
                      navigation={props.navigation}/>
    }

    const avatarUrl = userData.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    const fullName = userData.fullName || 'Default Name';
    const email = userData.email || '@kuky.com';
    const backgroundUrl =
        userData.backgroundUrl || CONSTANTS.DEFAULT_BG;
    /* Hide wallet and money transfer feature for ios */
    /* const options = ['Report', 'Reward', 'Block', 'Cancel']; */
    const options = CONSTANTS.IS_HIDE_WALLET_FEATURE
        ? ['Report', 'Block', 'Cancel']
        : (props.navigation.getParam('userId') == -999) ? ['Report', 'Block', 'Cancel'] : ['Report', 'Reward', 'Block', 'Cancel'];

    return (
        <UserProfileScreen
            {...props}
            defaultTab={defaultTab}
            userId={userId}
            userData={userData}
            isScanQRModal={isScanQRModal}
            setIsScanQRModal={setIsScanQRModal}
            isOwner={isOwner}
            setIsOverlayLoading={setIsOverlayLoading}
            isOverlayLoading={isOverlayLoading}

            create1To1Chat={create1To1Chat}
            _handleReport={_handleReport}
            _handleBlock={_handleBlock}
            handleTouchTab={handleTouchTab}
            handleLoadingData={handleLoadingData}
            _renderNetwork={_renderNetwork}
            _renderPosts={_renderPosts}
            _renderAbout={_renderAbout}

            avatarUrl={avatarUrl}
            fullName={fullName}
            email={email}
            backgroundUrl={backgroundUrl}
            options={options}
        />
    );
}

const mapStateToProps = store => ({
    user: store.user,
});
const UserProfileScreenContainerWrapper = connect(mapStateToProps)(UserProfileScreenContainer);
export default UserProfileScreenContainerWrapper;
