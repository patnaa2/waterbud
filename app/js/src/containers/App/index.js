import React, {PropTypes} from 'react';

const App = (props) => {
  return (
    <div>
      <h1>App</h1>
      {props.children}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element
};

export default App;
