import React, {PropTypes} from 'react';
import Highmaps from 'highcharts/modules/map';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';

import Chart from '../../components/Chart';
import SpecificLocation from '../../components/RoomSelect/SpecificLocation';

import * as actions from '../../actions/sensorsActions';
import * as miscActions from '../../actions/miscActions';
import DatePicker from 'react-datepicker';

class HistoricalHourlyUsage extends React.Component {
  constructor(props) {
    super(props);
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.retrieveHourlyHistoricalData = this.retrieveHourlyHistoricalData.bind(this);
    this.handleHistoricalLocation = this.handleHistoricalLocation.bind(this);
  }

  componentWillMount() {
    this.props.actions.fetchHourlyHistoricalData('total',
                                                this.formatDate(moment().subtract(1, 'months')),
                                                this.formatDate(moment()));
  }

  componentWillUnmount() {
    this.props.actions.retrieveNotifications();
  }

  formatDate(date) {
    return date.format("YYYY-MM-DD") + '%2000';
  }

  retrieveHourlyHistoricalData() {
    this.props.actions.fetchHourlyHistoricalData(this.props.historicalLocation,
                                                  this.formatDate(this.props.historicalHourlyStart),
                                                  this.formatDate(this.props.historicalHourlyEnd));
  }


  handleStartDate(date) {
    this.props.actions.handleHourlyStartDate(date);
  }

  handleEndDate(date) {
    this.props.actions.handleHourlyEndDate(date);
  }

  handleHistoricalLocation(location) {
    this.props.actions.updateHistoricalLocation(location);
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
        selected: 5
      },
      navigator : {
        series : {
          data : this.props.historicalData.toJS()
        }
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
        data: this.props.historicalData.toJS(),
        id: 'dataseries'
      }]
    };
    return (
      <div>
        <div>
          <SpecificLocation
            value={this.props.historicalLocation}
            onChange={this.handleHistoricalLocation}
          />
          <DatePicker
            selected={this.props.historicalHourlyStart}
            onChange={this.handleStartDate}
          />
          To
          <DatePicker
            selected={this.props.historicalHourlyEnd}
            minDate={moment(this.props.historicalHourlyStart).add(1, 'day')}
            maxDate={moment(this.props.historicalHourlyStart).add(1, 'month')}
            onChange={this.handleEndDate}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.retrieveHourlyHistoricalData}
          >
            Go
          </button>
        </div>
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

HistoricalHourlyUsage.propTypes = {
  actions: PropTypes.object,
  historicalData: PropTypes.object,
  loading: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    historicalLocation: state.sensors.get('historicalLocation'),
    historicalData: state.sensors.get('historicalData'),
    historicalHourlyStart: state.sensors.get('historicalHourlyStart'),
    historicalHourlyEnd: state.sensors.get('historicalHourlyEnd'),
    loading: state.sensors.get('loading')
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
)(HistoricalHourlyUsage);
