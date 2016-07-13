import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const Line = require('react-chartjs').Line;

import * as actions from '../../actions/sensorsActions';

class LiveUsage extends React.Component {
  componentWillMount() {
    /*eslint-disable*/
    this.socket = new WebSocket("ws://localhost:8888/ws");
    this.socket.onopen = () => {
      this.socket.send('message');
    };
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
          fillColor: 'rgba(220,220,220,0.5)',
          strokeColor: 'rgba(220,220,220,0.8)',
          highlightFill: 'rgba(220,220,220,0.75)',
          highlightStroke: 'rgba(220,220,220,1)',
          data: this.props.liveData.get('flow_ml').toJS()
        }
      ]
    };

    if(this.props.liveData.size === 0) {
      if (this.props.loading) {
        return <div>LOADING DATA!!!</div>;
      }
      return <div>NO DATA!</div>;
    }
    return (
      <div>
        <div>Live Usage</div>
        <Line data={chartData} width={window.innerWidth * 0.95} height="250"/>
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
