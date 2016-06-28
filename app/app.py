from flask import Flask, render_template
import os

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

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
