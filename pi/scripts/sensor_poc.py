import datetime
import json
import sys
import time
import websocket
from numpy import random

ws = websocket.create_connection("ws://localhost:8888/ws")

while True:
    try:
        data = {"timestamp": datetime.datetime.now().strftime("%H:%M:%S"),
                "flow_ml": random.randint(0, 5000)}
        ws.send(json.dumps(data))
        time.sleep(1)
    except KeyboardInterrupt:
        try:
            wc.close()
        except:
            pass
        sys.exit(0)
