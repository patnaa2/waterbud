from __future__ import division
from notifications import Notifications
import datetime
import pymongo
import sys

class Tips(Notifications):
    MONGO_LOCATION = "127.0.0.1:27017"
    DB = "test"

    def __init__(self, db=None, sleep=1):
        self._db = db 
        super(Tips, self).__init__(self._db)

        self.coll = 'tips'
        self.sleep = 1

    def garden_tips(self):
        short_msg = "Garden when it is cooler."
        long_msg = "Temperature is expected to cool by 3 degrees in the next "\
                   "2 hours. Consider watering during cooler times."
        data = {"date" : datetime.datetime.now().strftime("%m/%d %H:%M:%S"),
                "short_msg": short_msg,
                "long_msg" : long_msg,
                "location" : "garden",
		"image" : "garden"}
    
    def kitchen_sink_tips(self, data):
        short_dishes_msg = "Consder washing dishes in two seperate cycles."
        long_dishes_msg = "It is better to lather all the dishes and then rinse "\
                          "the dishes."

        short_prep_msg = "Consider washing vegetables in a large bowl."
        long_prep_msg = "It is recommended to wash the vegetables in a large "\
                        "bowl, or to not open the tap fully."

        raise_alert = False

        # data analysis

        # assume before 2 is prep
	if raise_alert:
	    if datetime.dateime.now().hour > 14:
		data = {"date" : datetime.datetime.now().strftime("%m/%d %H:%M:%S"),
			"short_msg": short_prep_msg,
			"long_msg" : long_prep_msg,
			"location" : "kitchen sink",
			"image" : "prep" }
            else:
                data = {"date" : datetime.datetime.now().strftime("%m/%d %H:%M:%S"),
                        "short_msg": short_dishes_msg,
                        "long_msg" : long_dishes_msg,
                        "location" : "kitchen",
			"image" : "dishes"}

    # Leak detection
    def bathroom_sink(self, data):
	MOCK = True
        pass
    
    def update_db(self, data):
        self._db[self.coll].insert_one(data)

    def run(self):
        while True:
            try: 
                if not self.sensor_location:
                    time.sleep(self.sleep)
                    continue
            except KeyboardInterrupt:
                print "Keyboard Interrupt Detected. Exiting"
                sys.exit(0)

if __name__ == '__main__':
    t = Tips()
    t.run()
