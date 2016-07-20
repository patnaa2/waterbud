from itertools import groupby
import pymongo
import datetime
import time
import sys

class Summarizer(object):
    PRICE_PER_LITRE = 1.51 / 1000
    MONGO_LOCATION = '127.0.0.1:27017'
    DB = 'waterbud'

    def __init__(self):
	self._db = None
        # Hack Anshuman 
        # Technically should be querying the db to get the 
        # most recent value in the hour/daily tables, but
        # this is fine for MVP
	self.last_processed = datetime.datetime.now()
        self.connect_to_db()

    @property
    def sensor_location(self):
        return self._db.add_sensor.find_one({}).get('location', None)

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

    def run(self):
        
        while True:
            try:
                while not self.sensor_location:
                    time.sleep(1)            

                coll_name = '%s_by_minute' %(self.sensor_location)
                hour_coll_name = '%s_by_hour' %(self.sensor_location)
                daily_coll_name = '%s_by_day' %(self.sensor_location)
                
                self.last_processed = self.last_processed.replace(second=0,
                                                             microsecond=0)
                res = self._db[coll_name].find(
                                {"timestamp": {"$gte": self.last_processed}})
                data = [(x["timestamp"], x["flow_ml"]) for x in res]
		self.last_processed = datetime.datetime.now()
                
                if data: 
                    for k, v in groupby(data, lambda x:x[0].hour):
			vals = list(v)
                        total = sum(x[1] for x in vals)
			total_cost = total / 1000 * self.PRICE_PER_LITRE 
		        hour_timestamp = vals[0][0].replace(minute=0,
                                                        second=0,
                                                        microsecond=0)
                        daily_timestamp = hour_timestamp.replace(hour=0)
			month_timestamp = daily_timestamp.replace(day=1)
                        # update location hourly
                        print "updating location by hour"
			ret = self._db[hour_coll_name].update_one({"timestamp": hour_timestamp},
								  {
								      "$inc": {
									  "flow_ml": total 
								      },
								  }, upsert=True)

                        # update total hourly
                        print "updating total by hour"
                        ret = self._db['total_by_hour'].update_one({"timestamp": hour_timestamp},
                                                                  {
                                                                      "$inc": {
                                                                          "flow_ml": total 
                                                                      },
                                                                  }, upsert=True)

                        # update location daily
                        print "updating location by day"
                        ret = self._db[daily_coll_name].update_one({"timestamp": daily_timestamp},
                                                                  {
                                                                      "$inc": {
                                                                          "flow_ml": total 
                                                                      },
                                                                  }, upsert=True)

                        ## update total daily 
                        print "updating total by day"
                        ret = self._db['total_by_day'].update_one({"timestamp": daily_timestamp},
                                                                  {
                                                                      "$inc": {
                                                                          "flow_ml": total 
                                                                      },
                                                                  }, upsert=True)

			# update cost
                        ret = self._db['monthly_summary'].update_one({"month": month_timestamp},
							      {
								  "$inc": {
								      "current_spending": total_cost 
								  },
							      }, upsert=True)
			print "Updated hour %s" %(k)
		print "Sleeping for 60"
                time.sleep(60)
            except KeyboardInterrupt:
                print "Keyboard Interrupt detected. Ending."
                sys.exit(1)
            # HACK - if there is a random error.. continue
            except Exception as e:
                print e
                continue

if __name__ == "__main__":
    s = Summarizer()
    s.run()
