/**
 * Chat modules
 */

import MemberListView from './members/MemberListView';
import MemberDetailView from './members/MemberDetailView';
import Application from '../constants/config';

// import NavBackAbs from '../chat/ui/NavBackAbs';
import NavBarBack from './ui/NavBarBack';

if (!Application.containers.find(item => item.key === 'memberDetail')) {
  // lets init reusable containers
  // key, title, subTitle, component, nav, tab, navBar
  Application.addContainer('memberDetail', 'Member Info', '', MemberDetailView, false, true, NavBarBack);
  Application.addContainer('roomInfo', 'Group Info', '', MemberListView, false, true, NavBarBack);
}

export { MemberDetailView, MemberListView };
