from __future__ import division
from notifications import Notifications
import datetime
import pymongo
import sys

class Tips(Notifications):

    def __init__(self, db=None, sleep=1):
        self._db = db 
        super(Tips, self).__init__(self._db)

        self.coll = 'tips'
        self.sleep = sleep
        self.tips_sent = False

    def garden_tips(self):
        short_msg = "Garden when it is cooler."
        long_msg = "Temperature is expected to cool by 3 degrees in the next "\
                   "2 hours. Consider watering during cooler times."
        data = {"timestamp" : datetime.datetime.now().strftime("%m/%d %H:%M:%S"),
                "short_msg": short_msg,
                "long_msg" : long_msg,
                "location" : "garden",
		"image" : "garden"}
        self.notify_and_tips(data)

    def kitchen_sink_tips(self, data):
        short_dishes_msg = "Consder washing dishes in two seperate cycles."
        long_dishes_msg = "It is better to lather all the dishes and then rinse "\
                          "the dishes."

        short_prep_msg = "Consider washing vegetables in a large bowl."
        long_prep_msg = "It is recommended to wash the vegetables in a large "\
                        "bowl, or to not open the tap fully."
        raise_alert = False
        
        # data analysis
        total_consumed = sum(data)
        print total_consumed
        threshold = 3500
        
        if total_consumed > threshold:
            raise_alert = True
        
        # assume before 2 is prep
	if raise_alert:
            now = datetime.datetime.now()
	    if now.hour < 14:
		data = {"timestamp" : now.strftime("%m/%d %H:%M:%S"),
			"short_msg": short_prep_msg,
			"long_msg" : long_prep_msg,
			"location" : "kitchen sink",
			"image" : "prep" }
            else:
                data = {"timestamp" : now.strftime("%m/%d %H:%M:%S"),
                        "short_msg": short_dishes_msg,
                        "long_msg" : long_dishes_msg,
                        "location" : "kitchen",
			"image" : "dishes"}
            self.update_db(data)

    # Leak detection
    def bathroom_sink_tips(self):
        msg = "CRITICAL: Tap left running in the bathroom sink."
        self.coll = 'notifications'
        self.general_alert(msg)

    def update_db(self, data):
        data['read'] = False
        print "Saving data to db:"
        print data
        self._db[self.coll].insert_one(data)
        self.tips_sent = True
    
    def notify_and_tips(self, data):
        # push to notifications first
        msg = data['short_msg']
        self.coll = 'notifications'
        self.general_alert(msg)

        # then tips
        self.coll = 'tips'
        self.update_db(data)

if __name__ == '__main__':
    print "This is just a helper class library. Don't call with main"
    sys.exit(1)
