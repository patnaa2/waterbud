from flask import Flask, render_template
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api, reqparse
from numpy import random as npy_rand 
import datetime
import json
import os
import pymongo
import sys

from api_helpers import convert_datetime_to_epoch as dt_to_epoch

WEBSOCKET = '127.0.0.1:8888'

## Override default template directory
template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                            'js', 'dist')

app = Flask(__name__,
            template_folder=template_dir,
            static_folder=template_dir)
api = Api(app)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Initialize db connection
#db = pymongo.MongoClient('localhost', 27017)['waterbud']

# Homepage
@app.route('/')
@cross_origin()
def index():
    return render_template('index.html')

## API Endpoints
LOCATIONS = ["bathroom sink", "kitchen sink", "shower", "garden"]
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
            val = 'testing'
 
        if not val:
            data = {"val": "testing"}

        return json.dumps(data), 200

    def post(self):
        # add logic to add sensor --> Mocked for MVP
        args = self.add_sensor_parser.parse_args()
        location = args['location']
        data = {"location" : location}

	return json.dumps(data), 201

    
    def delete(self):
        # we can't delete from a capped collection in mongo
        # we are just going to set the location in the current document to None
        try:
            data = db['add_sensor'].find_one({})
            location = data.get('location', None)
        except:
            location = "Testing"
    
        data = {"location": location}

	return json.dumps(data), 203

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
        
        ## mock 
        days = (end - start).days + 1 # 1 to be inclusive
        data = [ [ dt_to_epoch(start + datetime.timedelta(days=i)), 
                   npy_rand.randint(500, 750) ] for i in xrange(days)]
        total_consumed = sum(x[1] for x in data)

        data = {"data": data,
                "total_consumed": total_consumed}
	return json.dumps(data), 200 

class HourlySensorData(Resource):
    '''
        Returns total consumption per hour for a specified time range
        for a specified sensor location inclusively

        enter time in string format - %Y-%m-%d %H ie. 2016-07-16 12
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
        data = [ [ dt_to_epoch((start + datetime.timedelta(seconds=i*3600))), 
                   npy_rand.randint(20, 33) ] for i in xrange(hours)]
        total_consumed = sum(x[1] for x in data)
        
        data = {"data": data,
                "total_consumed": total_consumed}

        return json.dumps(data), 200 

class Threshold(Resource):
    '''
        Post - set a threshold for a location
        Get - returns a message when the amount of water consumed
              is past a certain percentage
    '''
    threshold_parser = reqparse.RequestParser()
    threshold_parser.add_argument('val', type=int)

    def get(self):
        args = self.threshold_parser.parse_args()
        loc = args['location']
        mock_val = 190
        data = {"val" : val}

        # save to db here, since we are just about to return
        return json.dumps(data), 200

    def post(self):
        args = self.threshold_parser.parse_args()
        val = args['val']
        data = {"val" : val}
        
        return json.dumps(data), 201

class Notifications(Resource):

    def get(self):
        # boolean to show whether to show limit or not
        display_limit = 1
        mock_msg_new = []
        mock_msg_recent = []

        mock_msg_new.append({"date": "07/16 14:16:12",
                             "msg":"It's only %s of %b, and you have spent 76% of your"\
                                   " total monthly budget. You're on track to spend $210(110%"\
                                   " of allocated budget)."})
        mock_msg_new.append({"date": "07/16 14:10:12",
                             "msg" : "CRITICAL Leak detected in kitchen sink."})
        
        mock_msg_recent.append({"date": "07/15 14:16:12",
                                "msg": "It's only July 15, and you have spent 74% of your"\
                                       " of allocated budget."})
        mock_msg_recent.append({"date": "07/15 14:16:12",
                                "msg": "It's only July 14, and you have spent 72% of your"\
                                       " of allocated budget."})

        data = {"notifications" : 2,
                "new_msgs" : mock_msg_new,
                "recent_msgs": mock_msg_recent} 
        
        # save to db here, since we are just about to return
        return json.dumps(data), 200

    def post(self):
        # mark all unread notifications to post 
        data = {"notifications_read": 2}
        return json.dumps(data), 202 

class Mock_Tips(Resource):
    def get(self):
	mock_msg_new = []
	mock_msg_recent = []

        mock_msg_new.append({"date": "07/16 14:16:12",
                             "msg":"The temperature is expected to reduce by 3 degrees in the"\
                                   " the next two hours. Water plants when the temperature is"\
                                   " cooler.",
                            "short" : "Garden when it is cooler.",
                            "location": "garden",
                            "iamge": "garden"})
        mock_msg_new.append({"date": "07/16 14:10:12",
                             "msg" : "Excceded amount of water used to wash dishes.",
                             "short": "Consder washing dishes in two seperate cycles.",
                             "location": "kitchen sink",
                             "image": "dishes"})

        mock_msg_recent.append({"date": "07/15 14:16:12",
                                "msg": "Exceeded amount of water used to prep vegetables."\
                                       " Consider washing vegetables in a bowls of water.",
                                "location": "kitchen sink",
                                "image": "prep"})
        mock_msg_recent.append({"date": "07/15 14:16:12",
                                "msg": "Temperature is expected to reduce by 2 degrees in the"\
                                       " next two hours.",
                                "short": "Garden when it is cooler.",
                                "location":"garden",
                                "image": "garden"})
        
        short_msgs = ["Water plants in the garden when it is cooler outside.",
                      "Limit the amount of water used when washing dishes by "\
                      "bathing and rinsing in two distinct steps."] 

        data = {"new":mock_msg_new, 
                "recent":mock_msg_recent,
                "short": short_msgs,
                "unread": 2}
        return json.dumps(data), 200

    def post(self):
        data = {"notifications_read": 2}
        return json.dumps(data), 202 

# Add all API endpoints after declaring them
api.add_resource(WSLocation, '/ws')
api.add_resource(AddSensor, '/add_sensor')
api.add_resource(DailySensorData, '/data/daily')
api.add_resource(HourlySensorData, '/data/hourly')
api.add_resource(Threshold, '/threshold')
api.add_resource(Notifications, '/notifications')
api.add_resource(Mock_Tips, '/tips')

if __name__ == '__main__':
    app.run()
