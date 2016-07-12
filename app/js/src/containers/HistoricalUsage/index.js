import React from 'react';
import Chart from '../../components/Chart';
import Highmaps from 'highcharts/modules/map';
import data from './data';

class HistoricalUsage extends React.Component {
  componentWillMount() {
    this.options  = {
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
        data: data,
        id: 'dataseries'
      }]
    };
  }

  render() {
    return (
      <div>
        <div>Historical Usage</div>
        <Chart
          container="stockChart"
          type="stockChart"
          options={this.options}
          modules={[Highmaps]}
        />
      </div>
    );
  }
}

export default HistoricalUsage;
