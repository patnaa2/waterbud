import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as actions from '../../actions/sensorsActions';
import * as SensorLocation from '../../constants/sensorLocations';

class Sensor extends React.Component {
  constructor(props) {
    super(props);
    this.onTextChange = this.onTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.props.actions.loadSensor(parseInt(this.props.params.id, 10));
  }

  onTextChange(key, e) {
    this.props.actions.updateSensor(key, e.target.value);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.actions.saveSensor(this.props.editSensor.get('id'), this.props.editSensor.get('location'));
    this.props.history.push('/sensors');
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label htmlFor="friendlyName">Name</label>
          <input
            type="text"
            className="form-control"
            id="friendlyName"
            placeholder="Friendly Name"
            value={this.props.editSensor.get('name')}
            onChange={this.onTextChange.bind(this, 'name')}
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <select
            id="location"
            className="form-control"
            value={this.props.editSensor.get('location')}
            onChange={this.onTextChange.bind(this, 'location')}
          >
            <option value={SensorLocation.BATHROOM_SINK}>Bathroom Sink</option>
            <option value={SensorLocation.GARDEN}>Garden</option>
            <option value={SensorLocation.KITCHEN_SINK}>Kitchen Sink</option>
            <option value={SensorLocation.SHOWER}>Shower</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-default"
          onClick={this.onSubmit}
        >
          Submit
        </button>
      </form>
    );
  }
}

Sensor.propTypes = {
  actions: PropTypes.object,
  editSensor: PropTypes.object
};

function mapStateToProps(state) {
  return {
    editSensor: state.sensors.get('editSensor')
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
)(Sensor);

