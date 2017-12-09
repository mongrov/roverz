/**
 * Chat modules
 */

import MemberListView from './members/MemberListView';
import MemberDetailView from './members/MemberDetailView';
import CameraActions from './attachments/CameraActions';
import PhotoLibrary from './attachments/PhotoLibrary';

import Application from '../constants/config';

import NavBackAbs from '../chat/ui/NavBackAbs';
import NavBarBack from './ui/NavBarBack';

if (!Application.containers.find(item => item.key === 'memberDetail')) {
  // lets init reusable containers
  // key, title, subTitle, component, nav, tab, navBar
  Application.addContainer('memberDetail', 'Member Info', '', MemberDetailView, true, true, NavBarBack);
  Application.addContainer('roomInfo', 'Group Info', '', MemberListView, true, true, NavBarBack);
  Application.addContainer('cameraActions', 'Camera', '', CameraActions, false, false, NavBackAbs);
  Application.addContainer('photoLibrary', 'Photo Library', '', PhotoLibrary, false, false, null);
  // attic, to be removed later
}

export { MemberDetailView, MemberListView, CameraActions, PhotoLibrary };
