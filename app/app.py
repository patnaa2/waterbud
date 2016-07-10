from flask import Flask, render_template
from flask_restful import Resource, Api
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

@app.route('/')
def index():
    return render_template('index.html')


## API Endpoints
class SensorData(Resource):

    def get(self, location, start, end):
        return {'location': location,
                'start': start,
                'end': end}


## Add all API endpoints after declaring them
api.add_resource(SensorData, '/data/<location>/<start>/<end>')

if __name__ == '__main__':
    app.run(debug=True)
