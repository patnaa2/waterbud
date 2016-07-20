from tips import Tips
import argparse
import datetime
import pymongo
import json
import sys
import time
import websocket

class Receiever(object):
    MONGO_LOCATION = "127.0.0.1:27017"
    DB = "waterbud"

    def __init__(self, ws_ip, ws_port):
        self.ws_location = "ws://%s:%s/ws" %(ws_ip, ws_port)
        self._ws = None
        self._db = None
                     
        # Try connecting to db, if failure (break)
        self.connect_to_db()
        
        # Block until we get a persistent connection to websocket
        self.init_ws()
        
        # Encapsulate the tips class
        self.tips = Tips()

    @property
    def sensor_location(self):
        return self._db.add_sensor.find_one({}).get('location', None)

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
            self._db = pymongo.MongoClient(self.MONGO_LOCATION)[self.DB]
        except:
            # treat any exception as a failure
            msg = "Unable to connect to database"
            self.epic_failure(msg)

    def epic_failure(self, text):
        print "\033[1;41m" + text + "\033[1;m"
        sys.exit(1)

    def run(self):
        flow_ml = 0
        data_analysis_time = None 
        kitchen_data = []
        first_time = True

        while True:
            try:
                while not self.sensor_location:
                    # after a switch of sensor we come back here
                    # set to false so we can send tips or not
                    print "waiting for sensor"
                    time.sleep(2)
                    first_time = True
                    self.tips.tips_sent = False

                current = datetime.datetime.now().replace(second=0,
                                                      microsecond=0)

                data = self._ws.recv()
                data = json.loads(data)
                data['timestamp'] = datetime.datetime.strptime(data['timestamp'],
                                          "%H:%M:%S").replace(year=current.year,
                                                              month=current.month,
                                                              day=current.day)
                flow_last_second = False
                
                ######
                ### Tips
                ######

                # This 100% should be threaded/subprocessed but okay for MVP
                ## short circuit ehre if we have already sent a tip
                if data['flow_ml'] and not self.tips.tips_sent: 
                    flow_last_second = True

                    if first_time:
                        data_analysis_time = datetime.datetime.now()
                        first_time = False

                    if self.sensor_location == "garden":
                        # wait atleast 10 seconds from first turning on 
                        print "garden"
                        if (datetime.datetime.now() - 
                                data_analysis_time).total_seconds() > 10:
                            self.tips.garden_tips()
                    elif self.sensor_location == "kitchen_sink":
                        # build up the ktchen data 
                        print "kitchen_sink"
                        kitchen_data.append(data['flow_ml'])
                    elif self.sensor_location == "bathroom_sink":
                        # show leak after 15 seconds 
                        print "bathroom_sink"
                        if (datetime.datetime.now() - 
                                data_analysis_time).total_seconds() > 15:
                            self.tips.bathroom_sink_tips()
                    else:
                        continue

                else:  ## if we don't have data ie. tap is off
                    first_time = True
                    flow_last_second = False
                
                # if flow has stopped or we have 60 data points for kitchen
                # send tips for kitchen
                if (kitchen_data and not flow_last_second) or \
                        (len(kitchen_data) > 60):
                    self.tips.kitchen_sink_tips(kitchen_data)
                    kitchen_data = []

                ######
                ### End Tips
                ######

                ######
                ### Data to DB
                ######
                # we are going to store directly to minute table for MVP
                # it doesnt make any sense to store per second and
                # have another 3 processes summarizing the data to 
                # hourly and historical data
                if current.minute == data['timestamp'].minute:
                    flow_ml += data['flow_ml']
                else:
                    if flow_ml:
                        db_data = {"timestamp": current, 
                                   "flow_ml" : flow_ml}
                        coll_name = "%s_by_minute" %(self.sensor_location)
                        print "Saving %s -- %s to %s" %(current, flow_ml,
                                                        coll_name)
                        self._db[coll_name].insert_one(db_data)
                        flow_ml = 0

                ######
                ### End data to DB
                ######

            except KeyError:
                msg = "Expecting a time field, with appropraite string format"
                self.epic_failure(msg)

            except TypeError as e:
                print e
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
   
    mr = Receiever(args.ws_host, args.port)
    mr.run()
