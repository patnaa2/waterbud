import React, {PropTypes} from 'react';
import {stack as Menu} from 'react-burger-menu';
import {Link} from 'react-router';

import './style.less';
import profile from '../../assets/profile_pic.jpg';

const App = (props) => {
  return (
    <div id="outer-container">
      <Menu pageWrapId={'page-wrap'} outerContainerId={'outer-container'}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/tips">Tips</Link></li>
        </ul>
      </Menu>
      <img src={profile} className="img-circle profile" alt="Profile Picture" />
      <main id="page-wrap">
        {props.children}
      </main>
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element
};

export default App;
