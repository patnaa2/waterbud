import React, {PropTypes} from 'react';
import {stack as Menu} from 'react-burger-menu';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import './style.less';
import profile from '../../assets/profile_pic.jpg';
import * as actions from '../../actions/miscActions';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
  }

  onMenuItemClick() {
    this.props.actions.menuClick(false);
  }

  isMenuOpen(state) {
    this.props.actions.menuClick(state.isOpen);
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
          <Link className="block" to="/" onClick={this.onMenuItemClick}>
            <i className="fa fa-home fa-fw" aria-hidden="true" />
            <span>Home</span>
          </Link>
          <Link className="block" to="/tips" onClick={this.onMenuItemClick}>
            <i className="fa fa-lightbulb-o fa-fw" aria-hidden="true" />
            <span>Tips</span>
          </Link>
          <Link className="block" to="/sensors" onClick={this.onMenuItemClick}>
            <i className="fa fa-server fa-fw" aria-hidden="true" />
            <span>Sensors</span>
          </Link>
          <Link className="block" to="/settings" onClick={this.onMenuItemClick}>
            <i className="fa fa-cog fa-fw" aria-hidden="true" />
            <span>Settings</span>
          </Link>
        </Menu>
        <img src={profile} className="img-circle profile" alt="Profile Picture" />
        <main id="page-wrap">
          {this.props.children}
        </main>
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
