import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import GridLayout from '../../components/Sensors/gridLayout';

import * as actions from '../../actions/sensorsActions';
import * as constants from '../../constants/viewConstants';
import './style.less';

class Sensors extends React.Component {
  render() {
    return (
      <div>
        <div className="buttonGroup">
          <span className="fa fa-2x fa-th" />
          <span className="fa fa-2x fa-list" />
          <button type="button" className="btn btn-success">Add Sensor</button>
        </div>
        {
          this.props.sensors.get('viewMode') === constants.CARD ?
          <GridLayout
            actions={this.props.actions}
            sensors={this.props.sensors.get('sensors')}
          /> :
          <div>TABLE VIEW</div>
        }
      </div>
    );
  }
}

Sensors.propTypes = {
  actions: PropTypes.object,
  sensors: PropTypes.object,
  viewMode: PropTypes.string
};

function mapStateToProps(state) {
  return {
    sensors: state.sensors
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sensors);
