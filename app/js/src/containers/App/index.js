import React, {PropTypes} from 'react';
import {stack as Menu} from 'react-burger-menu';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import './style.less';
import profile from '../../assets/profile_pic.jpg';
import logo from '../../assets/waterbud_logo.png';
import * as actions from '../../actions/miscActions';
import Notification from '../../components/Notifications';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.isMenuOpen = this.isMenuOpen.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
    this.openNotifications = this.openNotifications.bind(this);
    this.closeNotifications = this.closeNotifications.bind(this);
  }

  componentWillMount() {
    this.props.actions.retrieveSocketLocation();
  }

  onMenuItemClick() {
    this.props.actions.menuClick(false);
  }

  isMenuOpen(state) {
    this.props.actions.menuClick(state.isOpen);
  }

  pageHeader() {
    switch (this.props.location.pathname) {
      case '/sensors':
        return 'SENSORS';

      case '/live':
        return 'LIVE USAGE';

      case '/history':
        return 'HISTORICAL USAGE';

      case '/tips':
        return 'TIPS';

      case '/settings':
        return 'SETTINGS';

      case '/':
      default:
        return 'HOME';
    }
  }

  openNotifications(e) {
    e.preventDefault();
    this.props.actions.openNotifications();
  }

  closeNotifications(e) {
    e.preventDefault();
    this.props.actions.closeNotifications();
  }

  render() {
    return (
      <div id="outer-container">
        <Menu
          pageWrapId={'page-wrap'}
          outerContainerId={'outer-container'}
          customBurgerIcon={false}
          customCrossIcon={false}
          isOpen={this.props.misc.get('isOpen')}
          onStateChange={this.isMenuOpen}
        >
          <div>
            <Link
              activeClassName="active"
              className="block"
              to="/"
              onClick={this.onMenuItemClick}
            >
              <i className="fa fa-home fa-fw" aria-hidden="true" />
              <span>Home</span>
            </Link>
            <Link
              activeClassName="active"
              className="block"
              to="/sensors"
              onClick={this.onMenuItemClick}
            >
              <i className="fa fa-server fa-fw" aria-hidden="true" />
              <span>Sensors</span>
            </Link>
            <Link
              activeClassName="active"
              className="block"
              to="/live"
              onClick={this.onMenuItemClick}
            >
              <i className="fa fa-line-chart fa-fw" aria-hidden="true" />
              <span>Live Usage</span>
            </Link>
            <Link
              activeClassName="active"
              className="block"
              to="/history"
              onClick={this.onMenuItemClick}
            >
              <i className="fa fa-history fa-fw" aria-hidden="true" />
              <span>Historical Usage</span>
            </Link>
            <Link
              activeClassName="active"
              className="block"
              to="/tips"
              onClick={this.onMenuItemClick}
            >
              <i className="fa fa-lightbulb-o fa-fw" aria-hidden="true" />
              <span>Tips</span>
            </Link>
            <Link
              activeClassName="active"
              className="block"
              to="/settings"
              onClick={this.onMenuItemClick}
            >
              <i className="fa fa-cog fa-fw" aria-hidden="true" />
              <span>Settings</span>
            </Link>
          </div>
          <div className="footer">
              <img className="menu_logo" src={logo} />
              <h2 className="logo_header">WaterBud</h2>
              <h4 className="logo_slogan">Helping you and the Environment</h4>
          </div>
        </Menu>
        <section className="section">
          <div className="pageHeader">
            <img src={logo} className="logo" alt="Waterbud Logo" />
            <span>{this.pageHeader()}</span>
          </div>
          <div onClick={this.openNotifications} className="notification_btn">
            <span className="fa fa-2x fa-bell-o" />
            {this.props.misc.getIn(['notifications','notifications']) > 0 && <span className="number">{this.props.misc.getIn(['notifications','notifications'])}</span>}
          </div>
          <img src={profile} className="img-circle profile" alt="Profile Picture" />
        </section>
        <main id="page-wrap">
          {this.props.children}
        </main>
        <Notification
          isOpen={this.props.misc.get('notificationsOpen')}
          handleModalCloseRequest={this.closeNotifications}
          newNotifications={this.props.misc.getIn(['notifications', 'new_msgs'])}
          recentNotifications={this.props.misc.getIn(['notifications', 'recent_msgs'])}
        />
      </div>
    );
  }
}

App.propTypes = {
  actions: PropTypes.object,
  children: PropTypes.element,
  misc: PropTypes.object
};
function mapStateToProps(state) {
  return {
    misc: state.misc
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
)(App);
