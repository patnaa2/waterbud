import React from 'react';
import Highcharts from 'highcharts/highstock';

class Chart extends React.Component {
  componentDidMount() {
    // Extend Highcharts with modules
    if (this.props.modules) {
      this.props.modules.forEach(function(module) {
        module(Highcharts);
      });
    }

    // Disables Date Entry for HighCharts
    Highcharts.wrap(Highcharts.RangeSelector.prototype, 'drawInput', function (proceed, name) {
      proceed.call(this, name);
      this[name + 'DateBox'].on('click', function () {} );
    });

    // Set container which the chart should render to.
    this.chart = new Highcharts[this.props.type || "Chart"](
      this.props.container,
      this.props.options
    );
  }

  componentWillReceiveProps(nextProps) {
    this.chart.series[0].update({
      data: nextProps.options.series[0].data
    });
    this.chart.series[1].update({
      data: nextProps.options.series[0].data
    });
    this.chart.xAxis[0].setExtremes(
      nextProps.options.series[0].data[0][0],
      nextProps.options.series[0].data[nextProps.options.series[0].data.length-1][0]
    );
  }

  //Destroy chart before unmount.
  componentWillUnmount() {
    this.chart.destroy();
  }
  //Create the div which the chart will be rendered to.
  render() {
    return <div id={this.props.container} />;
  }
}

Chart.propTypes = {
  container: React.PropTypes.string,
  modules: React.PropTypes.any,
  options: React.PropTypes.object,
  type: React.PropTypes.string
};

export default Chart;
