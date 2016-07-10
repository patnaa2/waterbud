import React from 'react';
import FlipCard from 'react-flipcard';

class Card extends React.Component {
  handleOnFlip(flipped) {
    if (flipped) {
      //this.refs.backButton.getDOMNode().focus();
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
        {this.props.children}
      </FlipCard>
    );
  }
}

Card.propTypes = {
  children: React.PropTypes.node,
  isFlipped: React.PropTypes.bool
};

export default Card;
