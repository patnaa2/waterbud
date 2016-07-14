import React, {PropTypes} from 'react';
import FlipCard from './index.js';
import {retreiveFriendlyLocationName} from '../../helpers/sensorHelpers';

const SensorCard = (props) => {
  const {
    image,
    installDate,
    location,
    name,
    showBack,
    showFront,
    ...others
  } = props;
  return (
    <FlipCard {...others} showFront={showFront}>
      <div>
        <button type="button" onClick={showBack}>Show back</button>
        <img src={image}/>
        <div>{name}</div>
      </div>
      <div>
        <div>{installDate}</div>
        <div>{retreiveFriendlyLocationName(location)}</div>
        <button type="button" onClick={showFront}>Show front</button>
      </div>
    </FlipCard>
  );
};

SensorCard.propTypes = {
  image: PropTypes.string,
  installDate: PropTypes.string,
  location: PropTypes.string,
  name: PropTypes.string,
  showBack: PropTypes.func,
  showFront: PropTypes.func
};

export default SensorCard;
