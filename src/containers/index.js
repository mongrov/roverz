/**
 * Containers
 */

import ProfileView from './profile/ProfileView';
import ChangePassword from './profile/ChangePassword';
import ImageGallery from './image/ImageGallery';
import AboutView from './about/AboutView';
import ImagePreview from './image/ImagePreview';
import VideoPlayer from './video/VideoPlayer';
import CropImage from './profile/CropImage';


import Application from '../constants/config';

import NavBackAbs from '../chat/ui/NavBackAbs';
import NavBarBack from '../chat/ui/NavBarBack';

if (!Application.containers.find(item => item.key === 'aboutView')) {
  // lets init reusable containers
  // key, title, subTitle, component, nav, tab, navBar
  Application.addContainer('aboutView', 'About', '', AboutView, true, true, NavBarBack);
  Application.addContainer('profileView', 'Profile', '', ProfileView, true, true, NavBarBack);
  Application.addContainer('changePassword', 'Change Password', '', ChangePassword, true, true, null);
  Application.addContainer('imageGallery', 'Image Preview', '', ImageGallery, true, false, NavBackAbs);
  Application.addContainer('captureImagePreview', 'Image Preview', '', ImagePreview, true, true, NavBackAbs);
  Application.addContainer('videoPreviewSend', 'Video Preview Send', '', VideoPlayer, true, true, NavBackAbs);
  Application.addContainer('cropImage', 'CropImage', '', CropImage, true, true, NavBackAbs);
}

export { AboutView, ImageGallery, ProfileView, ImagePreview };
