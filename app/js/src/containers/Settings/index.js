import React, {PropTypes} from 'react';

class Settings extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row center-block">
          <div className="col-md-6 well">
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
              <div className="col-xs-10">(519) 888-4567</div>
            </div>
          </div>
          <div className="col-md-6 well">
            <h4>Application Settings</h4>
            <div className="row">
              <form className="form-inline">
                <div className="form-group">
                  <label forHtml="exampleInputName2">Threshold: </label>
                  <input type="text" className="form-control" id="exampleInputName2" placeholder="Jane Doe" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  action: PropTypes.object
};

export default Settings;
