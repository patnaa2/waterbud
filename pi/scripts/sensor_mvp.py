import RPi.GPIO as GPIO
import datetime
import json
import websocket 
import sys
import time

class Sensor(object):
    CALIBRATION_FACTOR = 4.5
    FLOW_SENSOR = 22

    def __init__(self, debug=False):
        self.count = 0
        self.old_time = int(time.time() * 1000)
        self._ws = None 
        self.debug = debug

        self.init_ws()
        self.init_GPIO()
    
    def init_ws(self, sleep=2):
        # Hack Anshuman July 12, 2016 
        # We are relying on init.d to get the two scripts up and running (ideally)
        # just in case the web socket isn't ready, be stuck in a loop until 
        # we can get the web socket connection
        while True:
            try:
                self._ws = websocket.create_connection("ws://localhost:8888/ws") 
                break
            except:
                print "Unable to connect to websocket. Trying again in %ssecs"\
                        %(secs)
                time.sleep(sleep)

    def init_GPIO(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.FLOW_SENSOR, GPIO.IN, pull_up_down = GPIO.PUD_UP)
        GPIO.add_event_detect(self.FLOW_SENSOR,
                              GPIO.FALLING,
                              callback=self.count_pulse)

    def count_pulse(self, channel):
        self.count += 1
    
    def run(self):
        while True:
            try:
                current_time = int(time.time() * 1000)
                current_dt = datetime.datetime.now()
                if (current_time - self.old_time) > 1000:
                    flow_rate = ((1000.0 / (current_time - self.old_time)) * self.count) / self.CALIBRATION_FACTOR
                    flow_ml = (flow_rate / 60) * 1000

                    if flow_ml > 0:
                        if self.debug:
                            print "Rate: %s" %(flow_rate)
                            print "Flow ml: %s" %(flow_ml)
                        data = { "timestamp": current_dt.strftime("%H:%M:%S"), 
                                 "flow_ml": flow_ml}
                        self._ws.send(json.dumps(data))
                    time.sleep(0.1)
                    self.old_time = int(time.time() * 1000)
                    self.count = 0
            except KeyboardInterrupt:
                try:
                    print "Keyboard interrupt. Exiting"
                    GPIO.cleanup()
                    wc.close()
                except:
                    pass
                sys.exit(0)

if __name__ == "__main__":
    s = Sensor()
    s.run()
