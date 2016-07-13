import datetime
import json
import sys
import time
import websocket

ws = websocket.create_connection("ws://localhost:8888/ws")

while True:
    try:
        data = {"time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "flow_ml": 304.2}
        ws.send(json.dumps(data))
        time.sleep(1)
    except KeyboardInterrupt:
        try:
            wc.close()
        except:
            pass
        sys.exit(0)
