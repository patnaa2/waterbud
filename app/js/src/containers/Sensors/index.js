import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import GridLayout from '../../components/Sensors/gridLayout';
import AddSensor from '../../components/Sensors/addSensor';

import * as actions from '../../actions/sensorsActions';
import * as constants from '../../constants/viewConstants';
import './style.less';

class Sensors extends React.Component {
  constructor(props) {
    super(props);
    this.handleModalCloseRequest = this.handleModalCloseRequest.bind(this);
    this.loadSensor = this.loadSensor.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.removeSensor = this.removeSensor.bind(this);
  }

  handleModalCloseRequest(e) {
    e.preventDefault();
    this.props.actions.closeModal();
  }

  loadSensor(index, e) {
    e.preventDefault();
    this.props.actions.loadSensor(index);
  }

  onTextChange(key, e) {
    this.props.actions.updateSensor(key, e.target.value);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.actions.saveSensor(this.props.sensors.getIn(['editSensor','id']),
                                  this.props.sensors.getIn(['editSensor','location']));
  }

  removeSensor(index, e) {
    e.preventDefault();
    this.props.actions.removeSensor(index);
  }

  render() {
    return (
      <div>
        <div className="buttonGroup">
          <span className="fa fa-2x fa-th" />
          <span className="fa fa-2x fa-list" />
          <button
            type="button"
            className="btn btn-success"
            onClick={this.loadSensor.bind(this, 0)}
          >
          Add Sensor
          </button>
        </div>
        {
          this.props.sensors.get('viewMode') === constants.CARD ?
          <GridLayout
            actions={this.props.actions}
            loadSensor={this.loadSensor}
            removeSensor={this.removeSensor}
            sensors={this.props.sensors.get('sensors')}
          /> :
          <div>TABLE VIEW</div>
        }
        <AddSensor
          element={this.props.sensors.get('editSensor')}
          handleModalCloseRequest={this.handleModalCloseRequest}
          handleSaveClicked={this.onSubmit}
          isOpen={this.props.sensors.get('editView')}
          onTextChange={this.onTextChange}
        />
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
