from __future__ import division
import calendar
import datetime
import pymongo
import sys

class Notifications(object):
    MONGO_LOCATION = "127.0.0.1:27017"
    DB = "test"

    def __init__(self, db=None, coll='notifications'):
        self._db = db 
        self.coll = coll

        # Try connecting to db, if failure (break)
        if not self._db:
            self.connect_to_db()
        
    def alert_leak(self, location):
        msg = "CRITICAL: Leak detected at %s sensor." %(location),
        self.general_alert(msg)

    def alert_usage_level(self):
        '''
            Hack function here, we will do some of the logic here, 
            since I am not really down to create a job/cron
            to take care of this, just do the analysis in the alert function..
            We can have an overhead process to take care of when to alert 
            so we don't get spammed consistently
        '''
        # $$$ ---> data analysis ---> bling bling
        month = datetime.datetime.now().replace(day=1,
						hour=0,
                                                minute=0, 
                                                second=0,
                                                microsecond=0)
        res = self._db['monthly_summary'].find_one({"month":month})
        limit = res["limit"]
        current = res["current_spending"]

        # Basic linear interpolation
        days_in_month = calendar.monthrange(month.year, month.month)[1]
        current_day = datetime.datetime.now().day
        days_left = days_in_month - current_day

        expected_spending = (current / current_day) * days_in_month 
        diff = expected_spending - limit
        percent_of_limit = int( diff / limit * 100)

        if expected_spending > limit:
            msg = "Warning: You are expected to overspend by $%.2f."\
                  " Expected monthly expense is $%.2f(%s%% of your set monthly limit)."\
                  %(diff, expected_spending, percent_of_limit)
        # let's do some positive reinforcement too
        elif expected_spending < limit:
            msg = "Great Job. You are expected to save $%.2f off your limit."\
                  " Expected monthly expense is $%.2f(%s%% of your set monthly limit)."\
                  %(diff, expected_spending, percent_of_limit)
        # in case somehow we make it equal.. idk how but sure
        else:
            msg = "Good Job. You are expected to meet your monthly limit of $%.2f."\
                    %(limit)
        
        # Hack Anshuman --> I have a gut feeling we are going to need to
        # need an easy way to differentiate these alerts from everything else
        # so I am just going to create a type field specifically for these 
        # alerts
        data = {"msg" : msg,
                "timestamp" : datetime.datetime.now(),
                "read" : False,
		"type" : "Usage Level"}
        self._db[self.coll].insert_one(data)

    def general_alert(self, msg):
        data = {"msg" : msg,
                "timestamp" : datetime.datetime.now(),
                "read" : False}
        self._db[self.coll].insert_one(data)

    def connect_to_db(self):
        try:
            self._db = pymongo.MongoClient(self.MONGO_LOCATION)[self.DB]
        except:
            # treat any exception as a failure
            msg = "Unable to connect to database"
            self.epic_failure(msg)

    def epic_failure(self, text):
        print "\033[1;41m" + text + "\033[1;m"
        sys.exit(1)

if __name__ == '__main__':
    print "This is just a helper class library. Don't call with main"
    sys.exit(1)
