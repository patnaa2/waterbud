import React from 'react';
import Card from '../../components/Card/sensorCard';

class GridLayout extends React.Component {
  constructor(props) {
    super(props);
    this.showBack = this.showBack.bind(this);
    this.showFront = this.showFront.bind(this);
  }

  showBack(index) {
    this.props.actions.flipSensorCard(index, true);
  }

  showFront(index) {
    this.props.actions.flipSensorCard(index, false);
  }

  render() {
    return (
      <div className="container-fluid">
        {this.props.sensors.map((element, index) =>
          <div key={index} className="col-sm-3">
            <Card
              isFlipped={element.get('isFlipped')}
              showBack={this.showBack.bind(this, index)}
              showFront={this.showFront.bind(this, index)}
              name={element.get('name')}
              location={element.get('location')}
            />
          </div>
        )}
      </div>
    );
  }
}

GridLayout.propTypes = {
  actions: React.PropTypes.object.isRequired,
  sensors: React.PropTypes.object.isRequired
};

export default GridLayout;
