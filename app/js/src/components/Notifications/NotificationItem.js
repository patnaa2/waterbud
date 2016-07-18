import React, {PropTypes} from 'react';

const NotificationItem = (props) => {
  return (
    <div className={props.className}>
      <div className="message">{props.message}</div>
      <div className="date">{props.date}</div>
    </div>
  );
};

NotificationItem.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string
};

export default NotificationItem;
