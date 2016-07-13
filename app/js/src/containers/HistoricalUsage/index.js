import React, {PropTypes} from 'react';
import Highmaps from 'highcharts/modules/map';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Chart from '../../components/Chart';

import * as actions from '../../actions/sensorsActions';

class HistoricalUsage extends React.Component {
  componentWillMount() {
    this.props.actions.fetchHistoricalData();
  }

  render() {
    if(this.props.historicalData.size === 0) {
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
        data: this.props.historicalData,
        id: 'dataseries'
      }]
    };
    return (
      <div>
        <div>Historical Usage</div>
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

HistoricalUsage.propTypes = {
  actions: PropTypes.object,
  historicalData: PropTypes.object,
  loading: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    historicalData: state.sensors.get('historicalData'),
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
)(HistoricalUsage);
