import RPi.GPIO as GPIO
import datetime
import websocket 
import sys
import time

class Sensor(object):
    CALIBRATION_FACTOR = 4.5
    FLOW_SENSOR = 22

    def __init__(self, debug=False):
        self.count = 0
        self.old_time = int(time.time() * 1000)
        self._ws = websocket.create_connection("ws://localhost:8888/ws")
        self.debug = debug

        self.init_GPIO()
         
    def init_GPIO(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(FLOW_SENSOR, GPIO.IN, pull_up_down = GPIO.PUD_UP)
        GPIO.add_event_detect(self.FLOW_SENSOR,
                              GPIO.FALLING,
                              callback=self.count_pulse)

    def count_pulse(self):
        self.count += 1
    
    def run(self):
        while True:
            try:
                current_time = int(time.time() * 1000)
                if current_time - self.old_time > 1000:
                    flow_rate = ((1000.0 / (current_time - self.old_time)) * self.count) / self.CALIBRATION_FACTOR
                    flow_ml = (flow_rate / 60) * 1000

                    if flow_ml > 0:
                        if self.debug:
                            print "Rate: %s" %(flow_rate)
                            print "Flow ml: %s" %(flow_ml)
                            continue
                        self._ws.send("timestamp: %s, flowrate: %s" %(current_time, 
                                                                      flow_ml)
                    self.old_time = int(time.time() * 1000)
            except KeyboardInterrupt:
                try:
                    print "Keyboard interrupt. Exiting"
                    wc.close()
                except:
                    pass
                sys.exit(0)

if __name__ == "__main__":
    s = Sensor()
    s.run()
