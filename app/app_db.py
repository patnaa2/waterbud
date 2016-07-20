from flask import Flask, render_template
from flask_restful import Api
from flask_cors import CORS, cross_origin
import os
import sys

# HACK:: Anshuman Wed July 06, 2016
# Not sure how we are going to be setting PYTHONPATH but just get it done
sys.path.insert(0, '/home/anshuman/waterbud/')
from app.api_endpoints import *

## Override default template directory
template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                            'js', 'dist')

## Specify Static folder location
## Hardcoded path for now since its just going to be an extension
## of this folder
static = "/js/dist"

app = Flask(__name__,
            template_folder=template_dir,
            static_folder=template_dir)
cors = CORS(app)
api = Api(app)

# Homepage
@app.route('/')
@cross_origin()
def index():
    return render_template('index.html')

## Add all API endpoints 
for api_handler, url in API_MAPPINGS.iteritems():
    api.add_resource(api_handler, url)

if __name__ == '__main__':
    app.run()
