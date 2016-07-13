import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/tipsActions';
import Card from '../../components/Card/tipCard';
import './cardStyle.less';

class Tips extends React.Component {
  constructor(props) {
    super(props);
    this.showBack = this.showBack.bind(this);
    this.showFront = this.showFront.bind(this);
  }

  showBack(index) {
    this.props.actions.flipTipCard(index, true);
  }

  showFront(index) {
    this.props.actions.flipTipCard(index, false);
  }

  render() {
    return (
      <div className="container-fluid">
        {this.props.tips.map((element, index) =>
          <div key={index} className="col-sm-3">
            <Card
              isFlipped={element.get('isFlipped')}
              showBack={this.showBack.bind(this, index)}
              showFront={this.showFront.bind(this, index)}
              location={element.get('location')}
              text={element.get('text')}
            />
          </div>
        )}
      </div>
    );
  }
}

Tips.propTypes = {
  actions: React.PropTypes.object.isRequired,
  tips: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    tips: state.tips
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tips);
