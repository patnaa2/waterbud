import React, {PropTypes} from 'react';
import Highmaps from 'highcharts/modules/map';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Chart from '../../components/Chart';

import * as actions from '../../actions/sensorsActions';

class LiveUsage extends React.Component {
  componentWillMount() {
    /*eslint-disable*/
    this.socket = new WebSocket("ws://192.168.0.19:8888/ws");
    this.socket.onopen = () => {
      this.socket.send('message');
    };
    this.socket.onmessage = (evt) => {
      console.log('evt', evt.data);
      const data = JSON.parse(evt.data);
      this.props.actions.receiveLiveData([data.timestamp]);
    };
  }

  componentWillUnmount() {
    this.socket = null;
    this.props.actions.resetLiveData();
  }

  render() {
    if(this.props.liveData.size === 0) {
      if (this.props.loading) {
        return <div>LOADING DATA!!!</div>;
      }
      return <div>NO DATA!</div>;
    }
    const options = {
      rangeSelector: {
        selected: 0
      },
      title: {
        text: 'Water Consumption'
      },
      tooltip: {
        style: {
          width: '200px'
        },
        valueDecimals: 4,
        shared: true
      },
      yAxis: {
        title: {
          text: 'Water Consumed (L)'
        }
      },
      series: [{
        name: 'Water Consumed (L)',
        data: this.props.liveData,
        id: 'dataseries'
      }]
    };
    return (
      <div>
        <div>Live Usage</div>
        <Chart
          container="stockChart"
          type="stockChart"
          options={options}
          modules={[Highmaps]}
        />
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
