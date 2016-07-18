from flask_restful import Resource, reqparse
from pymongo.errors import DuplicateKeyError
import json
import datetime
import os
import pymongo

# HACK:: Anshuman Wed July 06, 2016
# Not sure how we are going to be setting PYTHONPATH but just get it done
PY_PATH = os.path.join(os.path.expanduser("~"), "waterbud")
sys.path.insert(0, PY_PATH)

from api_helpers import *

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
                                                    minute=0, 
                                                    second=0,
                                                    microsecond=0)

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
    monthly_parser = reqparse.RequestParser()
    monthly_parser.add_argument('location')
    monthly_parser.add_argument('start')
    monthly_parser.add_argument('end')

    def get(self):
        args = self.monthly_parser.parse_args()
        location = args['location']
        start = datetime.datetime.strptime(args['start'], "%Y-%m-%d")
        end = datetime.datetime.strptime(args['end'], "%Y-%m-%d")
        
        res = db['%s_by_day' %(location)].find({"timestamp" :
                                                    {"$lte" : end, "$gte" : start}})
        data = [[x["timestamp"], x["flow_ml"]] for x in res]
        
        data = pad_data_with_zeros(data)
        import pdb ; pdb.set_trace()
        return json.dumps(data), 200 


class HourlySensorData(Resource):
    '''
        Returns total consumption per hour for a specified time range
        for a specified sensor location inclusively

        enter time in string format - %Y-%m-%d %H ie. 2016-07-16
    '''
    daily_parser = reqparse.RequestParser()
    daily_parser.add_argument('location')
    daily_parser.add_argument('start')
    daily_parser.add_argument('end')

    def get(self):
        args = self.daily_parser.parse_args()
        location = args['location']
        start = datetime.datetime.strptime(args['start'], "%Y-%m-%d %H")
        end = datetime.datetime.strptime(args['end'], "%Y-%m-%d %H")
        
        ## mock 
        hours = int((end - start).total_seconds() / 3600) + 1 # +1 to be inclusive
        data = [ [ str(start + datetime.timedelta(seconds=i*3600)), 
                   npy_rand.randint(20, 33) ] for i in xrange(hours)]
        data = {"data": data}

        return json.dumps(data), 200 

API_MAPPINGS = {WSLocation : "/ws_location",
		AddSensor : "/add_sensor",
		DailySensorData : "/data/daily",
                Threshold : "/threshold"}

