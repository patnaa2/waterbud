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
        <a className="home_logo" href="https://www.youtube.com/watch?v=esiiBljmMzM" target="_blank">
          <img src={logo} />
        </a>
        <h1 className="logo_header">WaterBud</h1>
        <h2 className="logo_slogan">Helping you and the Environment</h2>
        <div className="row about_us">
          <h4>Group of young professionals working towards building an innovative product for measuring water consumption and mitigating water waste in a household.</h4>
          <h4 className="coming_soon">Coming soon to retailers near you!</h4>
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
