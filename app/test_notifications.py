from notifications import Notifications
import time

n = Notifications()
n.alert_leak("shower")
n.general_alert("We are testing")
n.alert_usage_level()
