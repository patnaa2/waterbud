import React, {PropTypes} from 'react';
import './style.less';
import waterBottle from '../../assets/water_bottle.png';
import waterDispenserBottle from '../../assets/water_dispenser_bottle.png';

const round = (value) => Math.round(value * 100) / 100;

const RelativeGraph = (props) => {
  return (
    <div className="well center-block">
        <div className="row bottom_spacing total">Total Consumed: {round(props.consumed)}</div>
        <div className="row bottom_spacing">
          <div className="col-xs-5 col-xs-offset-1">
            <span>Water Bottle (500mL)</span>
            <img className="water_bottle" src={waterBottle} alt="Water Bottle" />
            <span> x {round(props.consumed / 500)} </span>
          </div>
          <div className="col-xs-5 col-xs-offset-1">
            <span>Water Dispenser Bottle (18.9 L)</span>
            <img className="water_dispenser_bottle" src={waterDispenserBottle} alt="Water Dispenser Bottle" />
            <span> x {round(props.consumed / 18900)} </span>
          </div>
        </div>
    </div>
  );
};

RelativeGraph.propTypes = {
  consumed: PropTypes.number
};

export default RelativeGraph;
