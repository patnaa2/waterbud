import React, {PropTypes} from 'react';

const NotificationItem = (props) => {
  return (
    <div className={props.className}>
      {props.message}
    </div>
  );
};

NotificationItem.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string
};

export default NotificationItem;
