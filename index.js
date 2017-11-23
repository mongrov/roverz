/*
 * Chat component
 */
import Placeholder from './src/components/general/Placeholder';
import Loading from './src/components/general/Loading';
import WebView from './src/components/general/WebView';

import Analytics from './src/lib/analytics';
import AppUtil from './src/lib/util';
import AppAPI from './src/lib/api';

import ModuleConfig from './src/constants/config';
import * as Containers from './src/containers';
import * as ChatComponents from './src/chat';

import rootReducer from './src/redux/index';
import * as SideMenuActions from './src/redux/sidemenu/actions';
import * as UserActions from './src/redux/user/actions';

import AuthLogin from './src/auth/Login/LoginContainer';
import SelectServer from './src/auth/SelectServer';
import SamlLogin from './src/auth/SamlLogin';

import Network from './src/network';

import CameraActions from './src/chat/ui/room/CameraActions';
import PhotoLibrary from './src/chat/ui/room/PhotoLibrary';
import MemberListView from './src/chat/members/MemberListView';
import MemberDetailView from './src/chat/members/MemberDetailView';
import SearchRoomView from './src/chat/ui/group/SearchRoomView';
import SearchListView from './src/chat/ui/group/SearchListView';
import MessageImageView from './src/chat/ui/room/MessageImageView';
import SupportGroup from './src/chat/ui/room/SupportGroup';
import ReplyMessageView from './src/chat/ui/room/ReplyMessageView';
import Menu from './src/containers/ui/Menu/MenuView';
import GroupList from './src/chat/groups/GroupView';
import RoomView from './src/chat/ui/room/RoomView';
import { NavbarMenuButton } from './src/containers/ui/NavbarMenuButton/NavbarMenuButtonContainer';

export {
    // general components
    Placeholder,
    Loading,
    WebView,

    CameraActions,
    PhotoLibrary,
    MemberListView,
    SearchRoomView,
    MemberDetailView,
    SearchListView,
    MessageImageView,
    SupportGroup,
    ReplyMessageView,
    Menu,
    GroupList,
    NavbarMenuButton,
    RoomView,

    // auth
    AuthLogin,
    SelectServer,
    SamlLogin,

    // utils
    Analytics,
    AppUtil,
    AppAPI,

    // constants
    ModuleConfig,

    // network
    Network,

    // redux
    rootReducer,
    SideMenuActions,
    UserActions,
};

// export all UI components
export * from './src/components/ui/';
export * from './src/chat/ui/';

// export all themes
export * from './src/theme/';

// -- EOF --
