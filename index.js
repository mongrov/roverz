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

export {
    // general components
    Placeholder,
    Loading,
    WebView,

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
