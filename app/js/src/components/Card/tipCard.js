import React from 'react';
import FlipCard from './index.js';
import {retreiveFriendlyLocationName, retrieveClassName} from '../../helpers/sensorHelpers';

const TipCard = (props) => {
  const {benefit, description, image, location, showBack, showFront, ...others} = props;
  console.log(benefit, description, image);
  return (
    <FlipCard {...others} showFront={showFront}>
      <div className={retrieveClassName(location)}>
        <div>Front</div>
        <span>{retreiveFriendlyLocationName(location)}</span>
        <button type="button" onClick={showBack}>Show back</button>
        <div><small>(manual flip)</small></div>
      </div>
      <div>
        <div>Back</div>
        <button type="button" onClick={showFront}>Show front</button>
      </div>
    </FlipCard>
  );
};

export default TipCard;
