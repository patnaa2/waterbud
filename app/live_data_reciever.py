from notifications import Notifications
import argparse
import datetime
import pymongo
import json
import sys
import time
import websocket

class Receiever(object):
    MONGO_LOCATION = "127.0.0.1:27017"
    DB = "test"

    def __init__(self, ws_ip, ws_port):
        self.ws_location = "ws://%s:%s/ws" %(ws_ip, ws_port)
        self.location = None
        self._ws = None
        self._db = None
                     
        # Try connecting to db, if failure (break)
        self.connect_to_db()
        
        # encapsulate notifcations object here
        self.notifications(db=self._db)

        self.find_sensor_location()
        # Block until we get a persistent connection to websocket
        self.init_ws()

    def find_sensor_location(self):
        '''
            Sensor location tells us which collection
            in mongo to actually store the data to, this will be stored
            upon adding a new sensor step
        '''
        # if we can't find this value, we exit
        try:
            val = self._db.add_sensor.find_one()
            self.location = val['location']
        except:
            msg = "The sensor is configured without a location."
            self.epic_failure(msg)

    def init_ws(self, sleep=2):
        '''
            Infinite loop until we establish a persistent connection with 
            the websocket.. without websocket we won't have data to store
        '''
        while True:
            try:
                self._ws = websocket.create_connection(self.ws_location)
                break
            except:
                print "Unable to connect to websocket %s." %(self.ws_location)
                print "Trying again in %s secs" %(sleep)
                time.sleep(sleep)

    def connect_to_db(self):
        try:
            self._db = pymongo.MongoClient(self.MONGO_LOCATION)['test']
        except:
            # treat any exception as a failure
            msg = "Unable to connect to database"
            self.epic_failure(msg)

    def epic_failure(self, text):
        print "\033[1;41m" + text + "\033[1;m"
        sys.exit(1)

    def run(self):
        flow_ml = 0
        current = datetime.datetime.now().replace(seconds=0,
                                                  microseconds=0)

        while True:
            try:
                data = self._ws.recv()
                data = json.loads(data)
                data['timestamp'] = datetime.datetime.strptime(data['time'],
                                                          "%Y-%m-%d %H:%M:%S")
                # we are going to store directly to minute table for MVP
                # it doesnt make any sense to store per second and
                # have another 3 processes summarizing the data to 
                # hourly and historical data
                if current == data['time'].minute:
                    flow_ml += data['flow_ml']
                    continue
                elif flow_ml:
                    db_data = {"timestamp": current, 
                               "flow_ml" : flow_ml}
                    self._db[self.location].insert_one(db_data)
            except KeyError:
                msg = "Expecting a time field, with appropraite string format"
                self.epic_failure(msg)
            except TypeError:
                msg = "Invalid data format"
                self.epic_failure(msg)
            except KeyboardInterrupt:
                try:
                    self._ws.close()
                except:
                    continue
                print "Exiting.."
                sys.exit(0)
    
if __name__ == '__main__':
    # setup args
    parser = argparse.ArgumentParser()
    parser.add_argument('-w', '--ws_host', help='Ip address of websocket server location',
                        default='127.0.0.1')
    parser.add_argument('-p', '--port', help='Port of websocket server location', 
                        default=8888)
    args = parser.parse_args()
   
    mf = MongoFiller(args.ws_host, args.port)
    mf.run()
