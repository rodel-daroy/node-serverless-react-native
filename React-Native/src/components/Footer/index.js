import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';

import PopupContext from '../../context/Popup/PopupContext';
import { refreshPosts } from '../../actions/postActions';
import Footer from './Footer';

const FooterContainer = (props) => {
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [createPostModal, setCreatePostModal] = useState(false);

  const callback = () => {
    props.dispatch(refreshPosts(
      (err) => { alert(err.response?.data?.message ?? 'error some where'); },
      props.user.accessToken,
      props.user.loggedStatus === "logged" ? props.user.subscribeToAdultContent : false,
      props.user.loggedStatus === "logged" ? props.user.over18 : false,
    ));
  }
  const activeData = props.active || 'conversation';
  return (
    <Footer
      {...props}
      createPostModal={createPostModal}
      setCreatePostModal={setCreatePostModal}
      activeData={activeData}
      callback={callback}
    />
  );
}

const MapStateToProps = store => ({
  user: store.user,
  peopleList: store.people.peopleList,
});
const FooterContainerWrapper = connect(MapStateToProps)(FooterContainer);
export default FooterContainerWrapper;
