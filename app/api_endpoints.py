from flask_restful import Resource, reqparse
from pymongo.errors import DuplicateKeyError
import json
import datetime
import os
import pymongo

WEBSOCKET = '127.0.0.1:8888'
db = pymongo.MongoClient('localhost', 27017)['waterbud']

class WSLocation(Resource):
    def get(self):
        return {'ws_location': WEBSOCKET}

class AddSensor(Resource):
    add_sensor_parser = reqparse.RequestParser()
    add_sensor_parser.add_argument('location')
    valid_locations = ["bathroom sink", "kitchen sink", "shower", "garden"]
        
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
        
        data = {"time_inserted" : datetime.datetime.utcnow(),
                "success" : True,
                "location": location}
        db['add_sensor'].insert_one(data)

        return location, 201
    
    def delete(self):
        # we can't delete from a capped collection in mongo
        # we are just going to set the location in the current document to None
        try:
            data = db['add_sensor'].find_one({})
            location = data.get('location', None)
        except:
            location = None

        if location:
            data['location'] = None 
            # We can't update a non-boolean field in capped collection,
            # since the size of the document cannot change, so just insert
            # a new field with location null
            # delete _id field to Avoid Duplicate Key Error 
            del data['_id']
            db['add_sensor'].insert_one(data)
            return location, 200
        else:
            return '', 204

class SensorData(Resource):                                                                           
    def get(self, location, start, end):
        return {'location': location,
                'start': start,
                'end': end}

class Threshold(Resource):
    threshold_parser = reqparse.RequestParser()
    threshold_parser.add_argument('val', type=int)
    threshold_parser.add_argument('location')

    def get(self):
        args = self.threshold_parser.parse_args()
        loc = args['location']

        if not loc:
            loc = db['add_sensor'].find_one({}).get('location', None)

        # current spending 
        # 0 - no
        # 1 - yes
        desired = db['thresholds'].find_one({"location":loc})['limit']
        current = db['monthly_summary'].find_one({})['dollar_spent']
        return val, 200

    def post(self):
        # add logic to add sensor --> Mocked for MVP
        args = self.threshold_parser.parse_args()
        val = args['val']
        loc = args['location']

        if not loc:
            loc = db['thresholds'].find_one({}).get('location', None)
        data = {"location" : loc,
                "limit" : val}
        if not val:
            val = 150

        try:
            db['thresholds'].insert_one(data)
        except DuplicateKeyError:
            # thresholds collection has a unique index on location
            # if same location is specified we need to do an update
            db['thresholds'].update_one({"location":loc}, 
                                        {
                                            "$set":{
                                                "limit": val
                                            },
                                        })

        return "%s: %s" %(loc, val), 201

API_MAPPINGS = {WSLocation : "/ws_location",
		AddSensor : "/add_sensor",
		SensorData : "/data/<location>/<start>/<end>",
                Threshold : "/threshold"}

