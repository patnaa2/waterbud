import React, {PropTypes} from 'react';
import Modal from '../Modal';
import NotificationItem from './NotificationItem';
import './style.less';

const Notifications = (props) => {
  const { recentNotifications, newNotifications, ...other } = props;
  return (
    <Modal
      {...other}
      bodyClassName=""
      title="Notifications"
      showFooter={false}
    >
      {!recentNotifications.size && !newNotifications.size && <h3>None!!!</h3>}
      {newNotifications.size > 0 && newNotifications.map((element, index) =>
        <NotificationItem
          key={index}
          className="notification_item new"
          message={element}
        />
      )}
      {recentNotifications.size > 0 && recentNotifications.map((element, index) =>
        <NotificationItem
          key={index}
          className="notification_item recent"
          message={element}
        />
      )}
    </Modal>
  );
};

Notifications.propTypes = {
  newNotifications: PropTypes.object,
  recentNotifications: PropTypes.object
};

export default Notifications;
