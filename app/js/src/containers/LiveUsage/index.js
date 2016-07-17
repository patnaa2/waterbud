import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
const Line = require('react-chartjs').Line;

import RelativeGraph from '../../components/RelativeGraph';

import * as actions from '../../actions/sensorsActions';
import './style.less';

class LiveUsage extends React.Component {
  componentWillMount() {
    /*eslint-disable*/
    this.socket = new WebSocket("ws://localhost:8888/ws");
    this.socket.onmessage = (evt) => {
      console.log('evt', evt.data);
      const data = JSON.parse(evt.data);
      this.props.actions.receiveLiveData(data.time, data.flow_ml);
    };
  }

  componentWillUnmount() {
    this.socket.close();
    this.props.actions.resetLiveData();
  }

  render() {
    const chartData = {
      labels: this.props.liveData.get('time').toJS(),
      showTable: false,
      datasets: [
        {
          label: 'My First dataset',
          fillColor: 'rgba(52,152,219,0.5)',
          strokeColor: 'rgba(52,152,219,0.8)',
          highlightFill: 'rgba(52,152,219,0.75)',
          highlightStroke: 'rgba(52,152,219,1)',
          data: this.props.liveData.get('flow_ml').toJS()
        }
      ]
    };

    return (
      <div className="center-block">
        <h2 className="header">Water Consumed (mL) over Time</h2>
        <h4 className="y_axis">Water Consumed (mL)</h4>
        <Line className="center-block" data={chartData} width={window.innerWidth * 0.96} height="450"/>
        <h4 className="x_axis">Time</h4>
        <RelativeGraph consumed={this.props.liveData.get('total_flow_ml')} />
      </div>
    );
  }

}

LiveUsage.propTypes = {
  actions: PropTypes.object,
  liveData: PropTypes.object,
  loading: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    liveData: state.sensors.get('liveData'),
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
)(LiveUsage);
