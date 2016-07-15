import React from 'react';
import Card from '../../components/Card/sensorCard';

class GridLayout extends React.Component {
  constructor(props) {
    super(props);
    this.onEdit = this.onEdit.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.showBack = this.showBack.bind(this);
    this.showFront = this.showFront.bind(this);
  }

  showBack(index) {
    this.props.actions.flipSensorCard(index, true);
  }

  showFront(index) {
    this.props.actions.flipSensorCard(index, false);
  }

  onEdit(id) {
    console.log('id', id);
    this.props.actions.loadSensor(id);
  }

  onRemove(id) {
    this.props.actions.removeSensor(id);
  }

  render() {
    return (
      <div className="container-fluid">
        {this.props.sensors.map((element, index) =>
          <div key={index} className="col-sm-3">
            <Card
              installDate={element.get('installDate')}
              isFlipped={element.get('isFlipped')}
              location={element.get('location')}
              name={element.get('name')}
              onEdit={this.onEdit.bind(this, element.get('id'))}
              onRemove={this.onRemove.bind(this, element.get('id'))}
              showBack={this.showBack.bind(this, index)}
              showFront={this.showFront.bind(this, index)}
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
