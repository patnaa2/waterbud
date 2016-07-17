import React from 'react';
import FlipCard from './index.js';
import * as Helper from '../../helpers/sensorHelpers';

const TipCard = (props) => {
  const {benefit, description, location, showBack, showFront, ...others} = props;
  console.log(benefit, description);
  return (
    <FlipCard {...others} showFront={showFront}>
      <div className={Helper.retrieveGeneralLocation(location).toLowerCase()} >
        <button
          className="btn btn-default flipBtn"
          type="button"
          onClick={showBack}
        >
          <span className="fa fa-reply" />
        </button>
        <span className="location">{Helper.retrieveGeneralLocation(location)}</span>
        <img className="image" src={Helper.retrieveImage(location)}/>
        <span className="name">{name}</span>
      </div>
      <div className={Helper.retrieveGeneralLocation(location).toLowerCase()}>
        <button
          className="btn btn-default flipBtn"
          type="button"
          onClick={showFront}
        >
          <span className="fa fa-reply" />
        </button>
        <div className="back_container">
          <div className="back_row spacing">Description</div>
        </div>
      </div>
    </FlipCard>
  );
};

export default TipCard;
