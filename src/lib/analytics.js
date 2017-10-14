/**
 * Custom Redux Middleware to track Redux Actions
 */
// Consts and Libs
import { ModuleConfig } from '../constants/';

const track = store => next => (action) => {
  // Track each screen view to Redux
  // - Requires that each Scene in RNRF have a 'analyticsDesc' prop
  switch (action.type) {
    case 'REACT_NATIVE_ROUTER_FLUX_FOCUS' :
      if (action && action.scene && action.scene.analyticsDesc) {
        try {
          const screenName = (action.scene.title)
            ? `${action.scene.analyticsDesc} - ${action.scene.title}`
            : action.scene.analyticsDesc;

          // Send to Google Analytics
          ModuleConfig.gaTracker.trackScreenView(screenName);
        } catch (err) {
          console.log(store);
          console.log(err);
        }
      }
      break;

    default :
  }
  return next(action);
};

export default track;
