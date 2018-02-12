/**
 * App Navigation
 */
import React from 'react';
import {
  StatusBar,
} from 'react-native';
import { Actions, Scene, ActionConst } from 'react-native-router-flux';

import {
  ChatNavBar,
  NavBarBack,
  RoomView,
  SearchRoomView,
  MessageImageView,
  ReplyMessageView,
  Placeholder,
  VideoPlayer,
  // NavBackAbs,
} from 'roverz-chat';

// Consts and Libs
import Application from '@app/config';
// Scenes
import AuthScenes from './auth';
import TabsScenes from './tabs';

// import Conference from './conference';
import HTMLView from './NativeHTMLView';

const helpContent = `
<div>
<img src="https://mongrov.com/mongrov-app-assets/UI-01-1.png" width="200" height="400" />
<h3>1. Message List:</h3>
<p>Shows the list of users with whom you are in communication and groups you are in participation. 
Tap on the user in chatlist,will take you to interaction room.</p>
<h3>2. Support:</h3>
<p>Our Support team is available  24x7 for your Queries.Please Contact us.</p>
<h3>3. New Conversation:</h3>
<p>Tap on the "Add conversation" (+) icon to search the member/group name to start a new conversation.</p>
<h3>4. About:</h3>
<p>Tap on logo the in the navbar will show the details of the redflock application.</p>
<img src="https://mongrov.com/mongrov-app-assets/UI-01-2.png" width="200" height="400" />
<h3>5. Your Profile:</h3>
<p>Tap on Profile icon to view your profile information.</p>
<h3>6. Attachments:</h3>
<p>You can share images from photolibrary of your device.</p>
<h3>7. Camera:</h3>
<p>You can capture photos, videos directly and share instantaneously.</p>
<h3>8. Message Bar:</h3>
<p>Start your conversation here. Type a message to send.</p>
<h3>9. Member Information:</h3>
<p>Tap on title bar to see member information for Direct User,Group information for Group Chats.</p>
<h3>10. Video Conference:</h3>
<p>Start your face-to-face conversation with single user or multiple users by using our video conference feature.</p>
</div>
`;

/* Routes ==================================================================== */
export default Actions.create(
  <Scene key={'root'} {...Application.navbarProps}>

    {/* Auth */}
    {AuthScenes}

    {/* Main App */}
    <Scene
      key={'app'}
      {...Application.navbarProps}
      title={Application.base.appName}
      hideNavBar={false}
      type={ActionConst.RESET}
    >
      <StatusBar barStyle="light-content" />
      {/* Drawer Side Menu */}
      <Scene key={'home'} initial={'tabBar'}>
        {/* Tabbar */}
        {TabsScenes}
      </Scene>

      {/* Chat */}
      <Scene
        hideTabBar
        clone
        key={'chatDetail'}
        title={'Chat'}
        duration={0}
        navBar={ChatNavBar}
        component={RoomView}
        analyticsDesc={'ChatDetails: chat'}
      />

      {/* Search Room */}
      <Scene
        hideTabBar
        navBar={NavBarBack}
        clone
        key={'searchRoom'}
        title={'Discover'}
        component={SearchRoomView}
        analyticsDesc={'Member List'}
      />

      {/* MessageImaeView for Chat room */}
      <Scene
        hideTabBar
        hideNavBar
        key={'imagePreview'}
        title={'Image Preview'}
        component={MessageImageView}
        analyticsDesc={'Image Preview'}
      />

      {/* Reply Message for Chat room */}
      <Scene
        hideTabBar
        hideNavBar
        key={'replyMessage'}
        title={'Reply Message'}
        component={ReplyMessageView}
        analyticsDesc={'Reply Message'}
      />

      {/* ------ below two modules need refactoring ------- */}

      {/* VideoPreview for Chat room */}
      <Scene
        hideTabBar
        hideNavBar
        key={'videoPreview'}
        title={'Video Preview'}
        component={VideoPlayer}
        analyticsDesc={'Video Preview'}
      />

      {/* VideoConference */}
      <Scene
        hideTabBar
        hideNavBar
        // navBar={NavBackAbs}
        clone
        key={'videoConference'}
        title={'Conference'}
        component={Placeholder}
        analyticsDesc={'Conference: bridge'}
      />

      {/* help */}
      <Scene
        hideTabBar
        // navBar={NavBackAbs}
        clone
        key={'helpView'}
        htmlContent={helpContent}
        title={'Help'}
        component={HTMLView}
        analyticsDesc={'Help view'}
      />

      {/* General */}
      <Scene
        clone
        key={'comingSoon'}
        title={'Coming Soon'}
        component={Placeholder}
        analyticsDesc={'Placeholder: Coming Soon'}
      />

      {/* ------------------------------- */}

      {Application.base.containers.map(item =>
        (<Scene
          key={item.key}
          {...item.props}
          hideNavBar={!item.nav}
          hideTabBar={!item.tab}
          navBar={item.navBar}
          title={item.title}
          subTitle={item.subTitle}
          component={item.component}
          analyticsDesc={item.title}
        />))
      }

    </Scene>
  </Scene>,
);
