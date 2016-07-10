import os
import socket
import subprocess
import sys
import time

# HACK:: Anshuman Wed July 06, 2016
# Not sure how we are going to be setting PYTHONPATH but just get it done
PY_PATH = os.path.join(os.path.expanduser("~"), "waterbud")
sys.path.insert(0, PY_PATH)
from lib.local_ap.LocalAccessPoint import LocalAccessPoint 
from lib.wifi.CurrentWifi import CurrentWifi

class AddSesnor(object):
    AP_SSID = 'waterbud'
    AP_PWD = 'brianso1'
    PORT = 27416

    def __init__(self):
        # For MVP, we are only creating one (so not a list)
        self.detected_sensor = None
        self.ap = LocalAccessPoint(self.AP_SSID, self.AP_PWD)
        self.wifi_creds = { "ssid" : None, 
                            "pwd" : None,
                            "dest" : None}

    def get_current_wifi_creds(self):
        cw = CurrentWifi()
        self.wifi_creds["ssid"] = cw.get_current_ssid()
        self.wifi_creds["pwd"] = cw.get_current_password()
        self.wifi_creds["dest"] = cw.get_current_ip_address()

    def start_ap(self):
        self.ap.create_ap()
        if not self.ap.verify_ap_is_up():
            msg = "Unable to start Local Access Point %s" %(self.AP_SSID)
            self.epic_failure(msg)
            sys.exit(1)
    
    def detect_sensor(self, timeout=600, sleep=10):
        '''
            Input: Optional timeout in seconds, how long we will waiting
                   for a device to connect to itself +
                   optional sleep which is the amount of time that we
                   will wait before checking again
            Output: returns the ip address of the connected device
            
            HACK Anshuman July 07, 2016:
                In practice there would have to be some extensive logic
                to ensure we don't have multiple devices connected to
                the local network. For our case, just assume that 
                the only sesnors will connect to the AP.
                AND.. it's not a safe function (an arp entry is made 
                upon the initial handshake), no gaurantee it is up
        '''
        # use ARP to get all the devices connected to the virtual device
        timeout = time.time() + timeout
        cmd = "arp | grep ap0 | awk -F \" \" \'{print $1}\'" 
        while time.time() < timeout:
            out = subprocess.check_output(cmd, shell=True)
            if out:
                self.detected_sensor = out
                break
            time.sleep(sleep)

    def exchange_information(self):
        '''
            Super Ghetto socket protocol.. again just need data
            transmitting, i am counting on TCP to take care of any
            weird data issues.
            
            We are not even going to do a SYN-ACK or simple handshake 
            to take care of any weird discrepancies
        '''
        # We want just a simple ack on the way back
        BUFFER_SIZE = 50
        msg = "%s, %s, %s" %(self.wifi_creds["ssid"],
                             self.wifi_creds["pwd"],
                             self.wifi_creds["dest"])

        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(self.detected_sensor, self.PORT)
        s.send(msg)
        
        # Now we have a blocking call waiting for an ACK from the sensor
        data = s.recv(BUFFER_SIZE)
        # Implement some error handling here (I will know once I play with the pi tmr)
        #if not data or data != "ACK":
        #    msg = "Detected failure while trying to communicate with sensor." \
        #          "Human Intervention Required"
        #    self.epic_failure(msg)
        s.close() 
        
    def run(self):
        self.get_current_wifi_creds()
        self.start_ap()
        self.detect_sensor()
        
        # By default this means we haven't detected another connection
        # on the ssid network in 10 mins... raise Error
        if not self.detected_sensor:
            msg = "No sensors detected on access point %s" %(self.AP_SSID)
            self.epic_failure(text)
            
        self.exchange_information()
        self.ap.kill_ap()

    def epic_failure(self, text):
        print "\033[1;41m" + text + "\033[1;m" 
        # We should be doing this with a signal/event style based
        # killing, but deadline (iterate and fix next time)
        if self.ap.verify_ap_is_up():
            self.ap.kill_ap()
        sys.exit(1)

if __name__ == "__main__":
    pass
