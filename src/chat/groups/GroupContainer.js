/**
 * Groups Screen Container
 * @todo: Not sure about this container, we will come back and fix this
 */
import { connect } from 'react-redux';

// The component we're mapping to
import GroupRender from './GroupView';

// What data from the store shall we send to the component?
const mapStateToProps = () => ({
});

// Any actions to map to the component?
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupRender);
