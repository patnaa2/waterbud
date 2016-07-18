import React, {PropTypes} from 'react';
import Select from 'react-select';

import * as SensorLocations from '../../constants/sensorLocations';
import * as Helper from '../../helpers/sensorHelpers';

const SpecificLocationSelect = (props) => {
  const {onChange, value, ...others} = props;
  return (
    <Select
      simpleValue
      {...others}
      clearable={false}
      value={value}
      options={[
        {
          value: 'total',
          label: 'All'
        },
        {
          value: SensorLocations.BATHROOM_SINK,
          label: Helper.retreiveFriendlyLocationName(SensorLocations.BATHROOM_SINK)
        },{
          value: SensorLocations.GARDEN,
          label: Helper.retreiveFriendlyLocationName(SensorLocations.GARDEN)
        },{
          value: SensorLocations.KITCHEN_SINK,
          label: Helper.retreiveFriendlyLocationName(SensorLocations.KITCHEN_SINK)
        },{
          value: SensorLocations.SHOWER,
          label: Helper.retreiveFriendlyLocationName(SensorLocations.SHOWER)
        }
      ]}
      onChange={onChange}
      placeholder="Room"
    />
  );
};

SpecificLocationSelect.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.number
};

export default SpecificLocationSelect;
