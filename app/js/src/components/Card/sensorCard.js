import React, {PropTypes} from 'react';
import FlipCard from './index.js';
import * as Helper from '../../helpers/sensorHelpers';

const SensorCard = (props) => {
  const {
    consumed,
    installDate,
    location,
    name,
    onEdit,
    onRemove,
    showBack,
    showFront,
    ...others
  } = props;
  return (
    <FlipCard {...others} showFront={showFront}>
      <div className={Helper.retrieveClassName(location)} >
        <button
          className="btn btn-default flipBtn"
          type="button"
          onClick={showBack}
        >
          <span className="fa fa-reply" />
        </button>
        <span className="location">{Helper.retreiveFriendlyLocationName(location)}</span>
        <img className="image" src={Helper.retrieveImage(location)}/>
        <span className="name">{name}</span>
      </div>
      <div>
        <button
          className="btn btn-default flipBtn"
          type="button"
          onClick={showFront}
        >
          <span className="fa fa-reply" />
        </button>
        <div className="back_container">
          <div className="back_row spacing">Install Date: {installDate}</div>
          <div className="back_row spacing">Total Consumed: {consumed}mL</div>
          <div className="back_row spacing actions">
            <button
              className="btn btn-danger"
              type="button"
              onClick={onRemove}
            >
              Delete
            </button>
            <button
              className="btn btn-success"
              type="button"
              onClick={onEdit}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </FlipCard>
  );
};

SensorCard.propTypes = {
  consumed: PropTypes.number,
  image: PropTypes.string,
  installDate: PropTypes.string,
  location: PropTypes.string,
  name: PropTypes.string,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  showBack: PropTypes.func,
  showFront: PropTypes.func
};

export default SensorCard;
