import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as actions from '../../actions/miscActions';
import './style.less';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.updateThreshold = this.updateThreshold.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
  }

  componentWillUnmount() {
    this.props.actions.retrieveNotifications();
  }

  saveSettings() {
    this.props.actions.saveSettings(this.props.threshold);
  }

  updateThreshold(e) {
    this.props.actions.updateThreshold(e.target.value);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row center-block setting-actions">
          <button
            type="button"
            className="btn btn-success"
            onClick={this.saveSettings}
          >
            Save
          </button>
        </div>
        <div className="row center-block">
          <div className="col-md-6 well setting_well">
            <h4>User Info</h4>
            <div className="row">
              <div className="col-xs-2">Name:</div>
              <div className="col-xs-10">Brian So</div>
            </div>
            <div className="row">
              <div className="col-xs-2">Email:</div>
              <div className="col-xs-10">brian.so@uwaterloo.ca</div>
            </div>
            <div className="row">
              <div className="col-xs-2">Phone No:</div>
              <div className="col-xs-10">(647) 609-9168</div>
            </div>
          </div>
          <div className="col-md-6 well setting_well">
            <h4>Application Settings</h4>
            <form className="form-inline">
              <div className="form-group">
                <label className="threshold" forHtml="threshold">Monthly Consumption Goal ($):</label>
                <input
                  id="threshold"
                  type="number"
                  className="form-control"
                  min="0"
                  value={this.props.threshold}
                  onChange={this.updateThreshold}
                />
              </div>
            </form>
          </div>
        </div>
        <div className="row center-block">
          <div className="col-md-12 well">
            <h4 className="title">Progession</h4>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>April</th>
                    <th>$174.45</th>
                  </tr>
                  <tr>
                    <th>May</th>
                    <th>$268.80</th>
                  </tr>
                  <tr>
                    <th>June</th>
                    <th>$213.36</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  actions: PropTypes.object,
  threshold: PropTypes.number
};

function mapStateToProps(state) {
  return {
    threshold: state.misc.get('threshold')
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
)(Settings);
