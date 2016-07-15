import React, {PropTypes} from 'react';
import Modal from '../Modal';

import * as SensorLocation from '../../constants/sensorLocations';

const AddSensor = (props) => {
  const {element, handleModalCloseRequest, handleSaveClicked, isOpen, onTextChange} = props;
  return (
    <Modal
      isOpen={isOpen}
      handleModalCloseRequest={handleModalCloseRequest}
      handleSaveClicked={handleSaveClicked}
      title={element.get('id') ? 'Edit Sensor' : 'New Sensor'}
    >
      <form onSubmit={handleSaveClicked}>
        <div className="form-group">
          <label htmlFor="friendlyName">Name</label>
          <input
            type="text"
            className="form-control"
            id="friendlyName"
            placeholder="Friendly Name"
            value={element.get('name')}
            onChange={onTextChange.bind(this, 'name')}
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <select
            id="location"
            className="form-control"
            value={element.get('location')}
            onChange={onTextChange.bind(this, 'location')}
          >
            <option value={SensorLocation.BATHROOM_SINK}>Bathroom Sink</option>
            <option value={SensorLocation.GARDEN}>Garden</option>
            <option value={SensorLocation.KITCHEN_SINK}>Kitchen Sink</option>
            <option value={SensorLocation.SHOWER}>Shower</option>
          </select>
        </div>
      </form>
    </Modal>
  );
};

AddSensor.propTypes = {
  element: PropTypes.object,
  handleSaveClicked: PropTypes.func,
  isOpen: PropTypes.bool,
  onTextChange: PropTypes.func
};

export default AddSensor;
