from flask import Flask, render_template
from flask_restful import Resource, Api
import datetime
import os
import pymongo

## Override default template directory
template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                            'js', 'dist')

## Specify Static folder location
## Hardcoded path for now since its just going to be an extension
## of this folder
static = "/js/dist"

app = Flask(__name__,
            template_folder=template_dir,
            static_url_path=static)
api = Api(app)

# Initialize db connection
db = pymongo.MongoClient('localhost', 27017)['waterbud']

# Homepage
@app.route('/')
def index():
    return render_template('index.html')

## API Endpoints
class AddSensor(Resource):
    def get(self):
        val = db['add_sensor'].find_one({})
        if not val:
            val = False
        # HACK Anshuman July 10, 2016
        # Not sure why but I cant seem to update a variable in post
        # and then get the new variable value in get
        # we are going to do a bs hack and store the value in db
        # (capped collection of object size 1)
        # and then we just make sure set the success value to false
        else:
            db['sensor_added'].remove()
        return {'success': val}
    
    def put(self):
        # add logic to add sensor
        data = {"time_inserted" : datetime.datetime.utcnow(),
                "success" : True}
        val_id = db['sensor_added'].insert_one(data).inserted_id
        print "PUT FUNCTION called"
        return val_id, 201

class SensorData(Resource):
    def get(self, location, start, end):
        return {'location': location,
                'start': start,
                'end': end}


## Add all API endpoints after declaring them
api.add_resource(AddSensor, '/add_sensor')
api.add_resource(SensorData, '/data/<location>/<start>/<end>')

if __name__ == '__main__':
    app.run(debug=True)
