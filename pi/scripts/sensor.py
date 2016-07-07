'''
    Main python script for the sensor, should be called 
    upon boot
'''
import os
import time
import sys
import socket
from enum import Enum
from uuid import getnode

# HACK:: Anshuman Wed July 06, 2016
# Not sure how we are going to be setting PYTHONPATH but just get it done
sys.path.insert(0, '../..')
from lib.wifi.WifiConnector import WifiConnector

class States(Enum):
    wifi_creds_pending = 1
    wifi_creds_recieved = 2
    success = 3
    failure = 4
    unknown = 10

class SensorState(object):

    def __init__(self, state_file='./sensor_state'):
        self.state_file = state_file
        self.current_state = None

        self.init_current_state()

    def init_current_state(self):
        # Write to state file upon init if file does not exist,
        # Instead of going through the overhead of creating a seperate lock
        # object to ensure if we can write the new file or not, an easier
        # method would be to just assume if the file exists, it is a lock
        # file.
        if not os.path.isfile(self.state_file):
            directory = os.path.dirname(self.state_file)
            if not os.path.exists(directory):
                os.makedirs(directory)
            self.current_state = States.wifi_creds_pending
            self.update_state_file()
        
        # if file exists, always trust that file as a source of truth for now
        # the only time this fails is if we run into a failure before saving
        # which is an edge case --> deal with later
        self.current_state = self.read_state_file()

    def __setattr__(self, item, value):
        '''
            Since we need to do a reboot to reset the credentials
            for network/ refresh a network connection, we need to
            make sure to store the state on disk

            Safest way to do this is to overload setattr function
            and just store in file anytime the sensor state gets assigned.
        '''
        if item == "current_state" and self.__dict__.get(item):
            self.update_state_file()
        self.__dict__[item] = value
    
    def read_state_file(self):
        with open(self.state_file, "r") as f:
            val = f.read()
        return States(int(val))

    def update_state_file(self):
        # Do a safe update, I am worried about a weird case when we can
        # accidently override with an incorrect value
        if self.read_state_file() == self.current_state:
            return

        with open(self.state_file, "w") as f:
            f.write("%s" %(self.current_state.value))
        
    def __str__(self):
        return "State ==> %s : %s" %(self.current_state.name, 
                                     self.current_state.value)

class Sensor(object):
    LAN_SSID = "waterbud"
    LAN_PWD = "BrianSO1"

    def __init__(self):
        self.state = SensorState()
        self.mac_address = getnode()

    def wait_for_wifi_creds(self, backoff=5, max_sleep=30):
        '''
            Loop Until we see the desired. We put some backoff so 
            we don't kill the pi trying to pint (also stops from 
            checking which wifi signals are being broadcast)

            We attach a max_sleep to ensure we don't end up waiting
            too long
        '''
        sleep = 10
        while True:
            # Find all current Wifi signals detected
            current_signals = WifiConnector.get_wifi_signals()
            if self.LAN_SSID in current_signals:
                break
            time.sleep(sleep)  
            if sleep <= max_sleep:
                sleep += backoff 
        
        # If we are here, it means a client is broadcasting
        # the SSID ie. someone has pressed "add a sensor"
        wc = WifiConnector(self.LAN_SSID, self.LAN_PWD)
        wc.connect()
    
        # Handshake protocol to exchange wifi information
        # between the client and sensor

    def run(self):
        if self.state == States.wifi_creds_pending:
            self.wait_for_wifi_creds()
        elif self.state == States.wifi_creds_recieved:
            self.confirm_wifi_creds()
        elif self.state == States.running:
            self.send_water_data()
        else:
            msg = "CRITICAL:: Sensor in Failed State."
            self.epic_failure(msg)

    def epic_failure(self, text):
        print "\033[1;41m" + text + "\033[1;m" 
        sys.exit(1)

if __name__ == "__main__":
    s = Sensor()
    s.run()
    import pdb ; pdb.set_trace()
