import React from 'react';
import FlipCard from 'react-flipcard';

class Card extends React.Component {
  handleOnFlip(flipped) {
    if (flipped) {
      this.refs.backButton.getDOMNode().focus();
    }
  }

  handleKeyDown(e) {
    if (this.props.isFlipped && e.keyCode === 27) {
      this.props.showFront();
    }
  }

  render() {
    return (
      <FlipCard
        disabled={true}
        flipped={this.props.isFlipped}
        onFlip={this.handleOnFlip}
        onKeyDown={this.handleKeyDown}
      >
        <div>
          <div>Front</div>
          <button type="button" onClick={this.props.showBack}>Show back</button>
          <div><small>(manual flip)</small></div>
        </div>
        <div>
          <div>Back</div>
          <button type="button" ref="backButton" onClick={this.props.showFront}>Show front</button>
        </div>
      </FlipCard>
    );
  }
}

Card.propTypes = {
  isFlipped: React.PropTypes.bool,
  showBack: React.PropTypes.func,
  showFront: React.PropTypes.func
};

export default Card;
