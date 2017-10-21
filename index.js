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

import rootReducer from './src/redux/index';
import * as SideMenuActions from './src/redux/sidemenu/actions';
import * as UserActions from './src/redux/user/actions';

import ProfileEditView from './src/auth/Profile/ProfileEditView';
import AuthWebView from './src/auth/WebView';
import AuthLogin from './src/auth/Login/LoginContainer';
import SelectServer from './src/auth/SelectServer';
import SSOTest from './src/auth/SSOTest';

export {
    // general components
    Placeholder,
    Loading,
    WebView,

    // auth
    ProfileEditView,
    AuthWebView,
    AuthLogin,
    SelectServer,
    SSOTest,

    // utils
    Analytics,
    AppUtil,
    AppAPI,

    // constants
    ModuleConfig,

    // redux
    rootReducer,
    SideMenuActions,
    UserActions,
};

// export all UI components
export * from './src/components/ui/';

// -- EOF --
