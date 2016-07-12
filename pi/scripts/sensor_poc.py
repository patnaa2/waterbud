import websocket 
import time
import sys

ws = websocket.create_connection("ws://localhost:8888/ws")

while True:
    try:
        ws.send("current_time : %s" %(time.time()))
        time.sleep(1)
    except KeyboardInterrupt:
        try:
            wc.close()
        except:
            pass
        sys.exit(0)
