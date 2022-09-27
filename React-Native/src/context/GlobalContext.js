import React from 'react';
import PostsProvider from './Posts/PostsProvider';
import UserProvider from './User/UserProvider';
import PopupProvider from './Popup/PopupProvider';
import DefaultErrorProvider from './DefaultError/DefaultErrorProvider';

const GlobalContext = (props) => (
  <PostsProvider>
    <UserProvider>
      <PopupProvider>
        <DefaultErrorProvider>{props.children}</DefaultErrorProvider>
      </PopupProvider>
    </UserProvider>
  </PostsProvider>
);

export default GlobalContext;
