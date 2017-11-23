/**
 * Containers
 */

import ProfileView from './profile/ProfileView';
import ImageGallery from './image/ImageGallery';
import AboutView from './about/AboutView';
import Application from '../constants/config';

import NavBackAbs from '../chat/ui/NavBackAbs';
import NavBarBack from '../chat/ui/NavBarBack';

if (!Application.containers.find(item => item.key === 'aboutView')) {
  // lets init reusable containers
  // key, title, subTitle, component, nav, tab, navBar
  Application.addContainer('aboutView', 'About', '', AboutView, false, true, NavBarBack);
  Application.addContainer('profileView', 'Profile', '', ProfileView, false, true, null);
  Application.addContainer('imageGallery', 'Image Preview', '', ImageGallery, false, false, NavBackAbs);
}

export { AboutView, ImageGallery, ProfileView };
