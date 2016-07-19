import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/tipsActions';
import * as miscActions from '../../actions/miscActions';
import Card from '../../components/Card/tipCard';
import TipModal from '../../components/TipModal';
import './style.less';
import * as Helper from '../../helpers/sensorHelpers';

class Tips extends React.Component {
  constructor(props) {
    super(props);
    this.showBack = this.showBack.bind(this);
    this.showFront = this.showFront.bind(this);
    this.openTipModal = this.openTipModal.bind(this);
    this.closeTipModal = this.closeTipModal.bind(this);
  }

  componentWillMount() {
    this.props.actions.retrieveTips();
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

  shortMessages(index, element) {
    if(index === 0) {
      return this.props.tips.getIn([element.get('title').toLowerCase(), 'short']);
    } else {
      return this.props.tips.get(element.get('title')).map((element) => element.get('short'));
    }
  }

  openTipModal(tipsToShow) {
    this.props.actions.openTipsModal(tipsToShow);
  }

  closeTipModal() {
    this.props.actions.closeTipsModal();
  }

  render() {
    console.log('tips', this.props.tips.toJS());
    //this.props.tips.getIn([element.get('title'), 'short'])
    return (
      <div>
        <div className="container-fluid">
          {this.props.tips.get('cards').map((element, index) =>
            <div key={index} className="col-sm-3">
              <Card
                isFlipped={element.get('isFlipped')}
                showBack={this.showBack.bind(this, index)}
                showFront={this.showFront.bind(this, index)}
                location={element.get('title')}
                shortMessages={this.shortMessages(index, element)}
                seeMoreClick={this.openTipModal}
              />
            </div>
          )}
        </div>
        <TipModal
          tips={this.props.tips.get(this.props.tips.get('tipsToShow').toLowerCase())}
          title={Helper.retrieveGeneralLocation(this.props.tips.get('tipsToShow'))}
          handleModalCloseRequest={this.closeTipModal}
          handleNextClicked={this.onNext}
          handlePrevClicked={this.onPrev}
          isOpen={this.props.tips.get('isOpen')}
        />
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
