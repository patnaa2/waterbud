from flask_restful import Resource, reqparse
from notifications import Notifications as Alerts
from pymongo.errors import DuplicateKeyError
import json
import datetime
import os
import pymongo
import sys

# HACK:: Anshuman Wed July 06, 2016
# Not sure how we are going to be setting PYTHONPATH but just get it done
PY_PATH = os.path.join(os.path.expanduser("~"), "waterbud")
sys.path.insert(0, PY_PATH)
from lib.api_helpers import convert_datetime_to_epoch as dt_to_epoch
from lib.api_helpers import pad_data_with_zeroes as pad_data

WEBSOCKET = '127.0.0.1:8888'
db = pymongo.MongoClient('localhost', 27017)['test']

class WSLocation(Resource):
    def get(self):
        return json.dumps({'ws_location': WEBSOCKET})

class AddSensor(Resource):
    add_sensor_parser = reqparse.RequestParser()
    add_sensor_parser.add_argument('location')
        
    def get(self):
        # HACK Anshuman July 12, 2016
        # Not sure why but I cant seem to update a variable in post
        # and then get the new variable value in get
        # we are going to do a bs hack and store the value in db
        # (capped collection of object size 1)
        # since for MVP we are not showing auto-discovery, have this
        # return a location, if not return null
        try:
            val = db['add_sensor'].find_one({}).get('location', None)
        except:
            val = None
        if not val:
            val = ''

        return val, 200

    def post(self):
        # add logic to add sensor --> Mocked for MVP
        args = self.add_sensor_parser.parse_args()
        location = args['location']
        
        data = {"time_inserted" : datetime.datetime.now(),
                "success" : True,
                "location": location}
        db['add_sensor'].insert_one(data)

        return json.dumps(data), 201
    
    def delete(self):
        # we can't delete from a capped collection in mongo
        # we are just going to set the location in the current document to None
        try:
            data = db['add_sensor'].find_one({})
            location = data.get('location', None)
        except:
            location = None

        if data:
            # We can't update a non-boolean field in capped collection,
            # since the size of the document cannot change, so just insert
            # a new field with location null
            # delete _id field to Avoid Duplicate Key Error 
            del data['_id']
            data['location'] = None 
        else:
            # if someone calls a delete when there is no data
            data = {"time_inserted": datetime.datetime.now,
                    "success" : False,
                    "location" : None }

        if location:
            # We can't update a non-boolean field in capped collection,
            # since the size of the document cannot change, so just insert
            # a new field with location null
            db['add_sensor'].insert_one(data)
            return json.dumps({"data": location}), 203
        else:
            return json.dumps({"data": "None"}), 204

class Threshold(Resource):
    threshold_parser = reqparse.RequestParser()
    threshold_parser.add_argument('val', type=int)
    threshold_parser.add_argument('month')

    def get(self):
        args = self.threshold_parser.parse_args()
        month = args['month']
        if month:
            month = datetime.strptime(month, "%m/%Y")
        else:
            month = datetime.datetime.now().replace(day=1, 
                                                    hour=0,
                                                    minute=0, 
                                                    second=0,
                                                    microsecond=0)
        
        print month
        data = db['monthly_summary'].find_one({"month": month})

        if not data:
            data = {"Error" : "Month not found. Try again."}
            return json.dumps(data), 400

        del data['_id']
        return json.dumps(data), 200

    def post(self):
        '''
            month will take the form of mon/year where mon and year are intengers
        '''
        args = self.threshold_parser.parse_args()
        val = args['val']
        month = args['month']

        if month:
            month = datetime.strptime(month, "%m/%Y")
        else:
            month = datetime.datetime.now().replace(day=1, 
                                                    hour=0,
                                                    minute=0, 
                                                    second=0,
                                                    microsecond=0)
            # if its current month -> recheck usage level
            n = Alerts()
            n.alert_usage_level()

        ret = db['monthly_summary'].update_one({"month": month}, 
                                                  {
                                                      "$set": {
                                                          "limit": val
                                                      },
                                                  }, upsert=True)
        
        data = {"month": month.strftime("%m/%Y"),
                "limit": val}


        return json.dumps(data), 201

class DailySensorData(Resource):
    '''
        Returns total consumption per day over specified time range
        for a specified sensor location inclusively

        enter time in string format - %Y-%d-%d ie. 2016-07-16
    '''
    daily_parser = reqparse.RequestParser()
    daily_parser.add_argument('location')
    daily_parser.add_argument('start')
    daily_parser.add_argument('end')

    def get(self):
        args = self.daily_parser.parse_args()
        location = args['location']
        start = datetime.datetime.strptime(args['start'], "%Y-%m-%d")
        end = datetime.datetime.strptime(args['end'], "%Y-%m-%d")
        
        res = db['%s_by_day' %(location)].find({"timestamp" :
                                                    {"$lte" : end, "$gte" : start}})
        data = [[x["timestamp"], x["flow_ml"]] for x in res]
        
        data = pad_data(data, start, end, table_type="daily")
        data = [[dt_to_epoch(x[0]), x[1]] for x in data]

        return json.dumps(data), 200 

class HourlySensorData(Resource):
    '''
        Returns total consumption per hour for a specified time range
        for a specified sensor location inclusively

        enter time in string format - %Y-%m-%d %H ie. 2016-07-16
    '''
    hourly_parser = reqparse.RequestParser()
    hourly_parser.add_argument('location')
    hourly_parser.add_argument('start')
    hourly_parser.add_argument('end')

    def get(self):
        args = self.hourly_parser.parse_args()
        location = args['location']
        start = datetime.datetime.strptime(args['start'], "%Y-%m-%d %H")
        end = datetime.datetime.strptime(args['end'], "%Y-%m-%d %H")
        
	res = db['%s_by_hour' %(location)].find({"timestamp" :
					    {"$lte" : end, "$gte" : start}})
        data = [[x["timestamp"], x["flow_ml"]] for x in res]
        
        data = pad_data(data, start, end, table_type="hourly")
        data = [[dt_to_epoch(x[0]), x[1]] for x in data]

        return json.dumps(data), 200 

class Notifications(Resource):
    RECENT_LIMIT = 4

    def get(self):
        # boolean to show whether to show limit or not
        new = []
        recent = []
        
        unread = db['notifications'].find({"read":False})
        read = db['notifications'].find({"read":True}).sort([
                            ("timestamp", 1)]).limit(self.RECENT_LIMIT)
        
        new = [{"date": x["timestamp"].strftime("%Y-%m-%d %H:%M:%S"), 
                "msg" : x["msg"]} for x in unread]
        recent = [{"date": x["timestamp"].strftime("%Y-%m-%d %H:%M:%S"),
                "msg" : x["msg"]} for x in read]

        data = {"notifications" : len(new),
                "new_msgs" : new,
                "recent_msgs": recent} 
        
        # save to db here, since we are just about to return
        return json.dumps(data), 200

    def post(self):
        # mark all unread notifications to post 
	ret = db['notifications'].update_many({"read": False}, 
                                               {
                                                   "$set": {
                                                       "read": True
                                                   },
                                               })
        return json.dumps({"notifications_read":ret.modified_count}), 201

class Tips(Resource):
    RECENT_LIMIT = 4

    def get(self):
        # boolean to show whether to show limit or not
        new = []
        recent = []

        unread = db['tips'].find({"read":False})
        read = db['tips'].find({"read":True}).sort([
                            ("timestamp", 1)]).limit(self.RECENT_LIMIT)

        new = [{"date": x["timestamp"].strftime("%Y-%m-%d %H:%M:%S"),
                "msg" : x["msg"]} for x in unread]
        recent = [{"date": x["timestamp"].strftime("%Y-%m-%d %H:%M:%S"),
                "msg" : x["msg"]} for x in read]

        data = {"notifications" : len(new),
                "new_msgs" : new,
                "recent_msgs": recent}

        # save to db here, since we are just about to return
        return json.dumps(data), 200

    def post(self):
        # mark all unread notifications to post 
        ret = db['tips'].update_many({"read": False},
				       {
					   "$set": {
					       "read": True
					   },
				       })
        return json.dumps({"notifications_read":ret.modified_count}), 201


API_MAPPINGS = {WSLocation : "/ws_location",
		AddSensor : "/add_sensor",
		DailySensorData : "/data/daily",
		HourlySensorData : "/data/hourly",
                Threshold : "/threshold",
                Notifications: "/notifications",
		Tips: "/tips"}

