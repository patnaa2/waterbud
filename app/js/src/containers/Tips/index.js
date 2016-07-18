import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/tipsActions';
import * as miscActions from '../../actions/miscActions';
import Card from '../../components/Card/tipCard';
import './style.less';

class Tips extends React.Component {
  constructor(props) {
    super(props);
    this.showBack = this.showBack.bind(this);
    this.showFront = this.showFront.bind(this);
  }

  componentWillUnmount() {
    this.props.actions.retrieveNotifications();
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
    actions: bindActionCreators(Object.assign({}, actions, miscActions), dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tips);
