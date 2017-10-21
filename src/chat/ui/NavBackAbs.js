import React from 'react';
import {
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';

export default class NavBackAbs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
    };
  }

  componentWillMount() {
    /* this.setState({
      title: AppConfig.base.instance,
    }); */
  }

  componentDidMount() {

  }

  render() {
    return (
      <TouchableOpacity
        style={[{
          position: 'absolute',
          top: 20,
          left: 20,
          padding: 5,
          backgroundColor: 'white',
          borderRadius: 40,
        }]}
        onPress={Actions.pop}
      >
        <Icon
          name="arrow-back"
          size={30}
          color="#000"
          width={30}
        />
      </TouchableOpacity>
    );
  }
}

NavBackAbs.defaultProps = {
  title: '',
};

NavBackAbs.propTypes = {
  title: PropTypes.string,
};
