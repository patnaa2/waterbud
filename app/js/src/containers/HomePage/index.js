import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/miscActions';

import logo from '../../assets/waterbud_logo.png';
import './style.less';

class Home extends React.Component {
  constructor() {
    super();
  }

  componentWillUnmount() {
    this.props.actions.retrieveNotifications();
  }

  render() {
    return (
      <div className="container-fluid home">
        <img className="home_logo" src={logo} />
        <h1 className="logo_header">Waterbud</h1>
        <h2 className="logo_slogan">Helping you and the Environment</h2>
        <div className="row about_us">
          <h4>Company Description goes here!!!</h4>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  actions: PropTypes.object,
  historicalData: PropTypes.object,
  loading: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    loading: state.sensors.get('loading')
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
)(Home);
