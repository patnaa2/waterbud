import React, {PropTypes} from 'react';
import Select from 'react-select';

import * as SensorLocations from '../../constants/sensorLocations';
import * as Helper from '../../helpers/sensorHelpers';

const RoomSelect = (props) => {
  const {onChange, value, ...others} = props;
  return (
    <Select
      multi
      simpleValue
      {...others}
      value={value}
      options={[
        {
          value: SensorLocations.BATHROOM_SINK,
          label: Helper.retrieveGeneralLocation(SensorLocations.BATHROOM_SINK)
        },{
          value: SensorLocations.GARDEN,
          label: Helper.retrieveGeneralLocation(SensorLocations.GARDEN)
        },{
          value: SensorLocations.KITCHEN_SINK,
          label: Helper.retrieveGeneralLocation(SensorLocations.KITCHEN_SINK)
        }
      ]}
      onChange={onChange}
      placeholder="Room"
    />
  );
};

RoomSelect.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.number
};

export default RoomSelect;
