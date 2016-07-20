import React, {PropTypes} from 'react';
import './style.less';
import waterBottle from '../../assets/water_bottle.png';
import waterDispenserBottle from '../../assets/water_dispenser_bottle.png';

const numBottles = (value, units) => {
  if (units === 'mL') {
    return round(value / 500);
  }
  return round(value * 2);
};

const numDispensers = (value, units) => {
  if (units === 'L') {
    return round(value / 18.9);
  }
  return round((value * 1000) / 18.9);
};

const round = (value) => Math.round(value * 100) / 100;

const RelativeGraph = (props) => {
  return (
    <div className="well center-block relative_graph">
        <div className="row bottom_spacing relative_header"><h2>Consumption Breakdown</h2></div>
        <div className="row bottom_spacing relative_header">
          <h4>You have consumed {round(props.consumed)} {props.units}, which is equivalent to:</h4>
        </div>
        <div className="row bottom_spacing">
          <div className="col-xs-5 col-xs-offset-1">
            <span>Water Bottle (500mL)</span>
            <img className="water_bottle" src={waterBottle} alt="Water Bottle" />
            <span> x {numBottles(props.consumed, props.units)}</span>
          </div>
          <div className="col-xs-5 col-xs-offset-1">
            <span>Water Dispenser Bottle (18.9 L)</span>
            <img className="water_dispenser_bottle" src={waterDispenserBottle} alt="Water Dispenser Bottle" />
            <span> x {numDispensers(props.consumed, props.units)} </span>
          </div>
        </div>
    </div>
  );
};

RelativeGraph.propTypes = {
  consumed: PropTypes.number,
  units: PropTypes.string
};

export default RelativeGraph;
