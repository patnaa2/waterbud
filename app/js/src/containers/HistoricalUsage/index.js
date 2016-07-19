import React, {PropTypes} from 'react';
import Highmaps from 'highcharts/modules/map';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';

import DatePicker from 'react-datepicker';
import Spinner from 'react-spinkit';
import Chart from '../../components/Chart';
import SpecificLocation from '../../components/RoomSelect/SpecificLocation';
import RelativeGraph from '../../components/RelativeGraph';

import * as actions from '../../actions/sensorsActions';
import * as miscActions from '../../actions/miscActions';
import * as Constants from '../../constants/viewConstants';

import './style.less';

class HistoricalUsage extends React.Component {
  constructor(props) {
    super(props);
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.retrieveHistoricalData = this.retrieveHistoricalData.bind(this);
    this.handleHistoricalLocation = this.handleHistoricalLocation.bind(this);
    this.toggleResolution = this.toggleResolution.bind(this);
  }

  componentWillMount() {
    if(this.props.historicalResolution === Constants.DAILY) {
      this.props.actions.fetchDailyHistoricalData('total',
                                                this.formatDate(this.props.historicalStart),
                                                this.formatDate(this.props.historicalEnd));
    } else {
      this.props.actions.fetchHourlyHistoricalData('total',
                                                this.formatDate(this.props.historicalStart),
                                                this.formatDate(this.props.historicalEnd));
    }
  }

  componentWillUnmount() {
    this.props.actions.resetHistoricalDates();
    this.props.actions.retrieveNotifications();
  }

  formatDate(date) {
    if(this.props.historicalResolution === Constants.DAILY) {
      return date.format("YYYY-MM-DD");
    }
    return date.format("YYYY-MM-DD") + '%2000';
  }

  retrieveHistoricalData(loc = null) {
    const location = (!loc || typeof loc === "object") ? this.props.historicalLocation : loc;
    if(this.props.historicalResolution === Constants.DAILY) {
      this.props.actions.fetchDailyHistoricalData(location,
                                                  this.formatDate(this.props.historicalStart),
                                                  this.formatDate(this.props.historicalEnd));
    } else {
      this.props.actions.fetchHourlyHistoricalData(location,
                                                  this.formatDate(this.props.historicalStart),
                                                  this.formatDate(this.props.historicalEnd));
    }
  }

  toggleResolution(resolution, e) {
    e.preventDefault();
    this.props.actions.updateHistoricalResolution(resolution);
  }

  handleStartDate(date) {
    this.props.actions.handleStartDate(date);
  }

  handleEndDate(date) {
    this.props.actions.handleEndDate(date);
  }

  handleHistoricalLocation(location) {
    this.props.actions.updateHistoricalLocation(location);
    this.retrieveHistoricalData(location);
  }

  render() {
    if(this.props.historicalData.size === 0) {
      if (this.props.loading) {
        return <Spinner spinnerName="double-bounce" />;
      }
      return (
        <div className="container-fluid">
          <h2 className="header">No Data</h2>
        </div>
      );
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
        <div className="center-block controls_container">
          <SpecificLocation
            className="specific_location"
            value={this.props.historicalLocation}
            onChange={this.handleHistoricalLocation}
          />
          <div className="toggle_controls">
            <button
              className={this.props.historicalResolution === Constants.HOURLY ? 'btn btn-primary' : 'btn btn-default btn-primary-outline'}
              onClick={this.toggleResolution.bind(this, Constants.HOURLY)}
            >
              Hourly
            </button>
            <button
              className={this.props.historicalResolution === Constants.DAILY ? 'btn btn-primary' : 'btn btn-default btn-primary-outline'}
              onClick={this.toggleResolution.bind(this, Constants.DAILY)}
            >
              Daily
            </button>
          </div>
          <div className="date_controls">
            <DatePicker
              selected={this.props.historicalStart}
              onChange={this.handleStartDate}
            />
            <span>To</span>
            <DatePicker
              selected={this.props.historicalEnd}
              minDate={moment(this.props.historicalStart).add(1, 'day')}
              maxDate={
                this.props.historicalResolution === Constants.DAILY ?
                null :
                moment(this.props.historicalStart).add(7, 'days')
              }
              onChange={this.handleEndDate}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.retrieveHistoricalData}
            >
              Go
            </button>
          </div>
        </div>
        <Chart
          container="stockChart"
          type="stockChart"
          options={options}
          modules={[Highmaps]}
        />
        <RelativeGraph consumed={this.props.historicalConsumption} />
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
    historicalLocation: state.sensors.get('historicalLocation'),
    historicalData: state.sensors.get('historicalData'),
    historicalStart: state.sensors.get('historicalStart'),
    historicalEnd: state.sensors.get('historicalEnd'),
    historicalResolution: state.sensors.get('historicalResolution'),
    historicalConsumption: state.sensors.get('historicalConsumption'),
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
)(HistoricalUsage);
