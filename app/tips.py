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

    @property
    def sensor_location(self):
        return db['add_sensor'].find_one({}).get('location', None)

    def garden_tips(self):
        pass
    
    def kitchen_tips(self):
        pass

    def bathroom_tips(self):
        pass

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

