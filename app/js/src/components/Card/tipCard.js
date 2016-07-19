import React from 'react';
import FlipCard from './index.js';
import * as Helper from '../../helpers/sensorHelpers';

const TipCard = (props) => {
  const {location, showBack, showFront, shortMessages, seeMoreClick, ...others} = props;
  function renderShortMessages() {
    if (shortMessages && shortMessages.size > 0) {
      return shortMessages.map((element, index) =>
        <div key={index} className="back_tip_row spacing">
          <div className="col-xs-2">
            <span className="tipNumber">{index + 1}</span>
          </div>
          <div className="col-xs-10">
            {element}
          </div>
        </div>
      );
    }
  }
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
          <div className="back_row spacing">
            {renderShortMessages()}
          </div>
          <div className="back_row tip_button">
            <button
              type="button"
              className="btn btn-success"
              onClick={seeMoreClick.bind(this, location)}
            >
              See More
            </button>
          </div>
        </div>
      </div>
    </FlipCard>
  );
};

export default TipCard;
