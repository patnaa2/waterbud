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
    // Set container which the chart should render to.
    this.chart = new Highcharts[this.props.type || "Chart"](
      this.props.container,
      this.props.options
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
