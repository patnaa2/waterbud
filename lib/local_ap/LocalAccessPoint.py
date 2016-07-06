import os
import signal
import subprocess

class LocalAccessPoint(object):
    '''
    Python wrapper around create_ap script.
    Courtesy of https://github.com/oblique/create_ap
    For security reasons, only going to be using wpa2
    and without ip-forwarding via iptables 
    just for creating a localAP for the sensor solution
    '''
    def __init__(self, ssid, password, device='wlp2s0'):
        self.ssid = ssid
        self.password = password
        self.device = device
        self.ap_process = None
        
    def create_ap(self):
        if self.verify_ap_is_up():
            return
        cmd = "sudo /usr/bin/create_ap -n %s %s %s" %(self.device,
                                                      self.ssid, 
                                                      self.password)
        self.ap_process = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                                           shell=True, preexec_fn=os.setsid)
        
    def kill_ap(self):
        if self.verify_ap_is_up:
            os.killpg(os.getpgid(self.ap_process.pid), signal.SIGTERM)
            self.ap_process = None

    def verify_ap_is_up(self):
        if self.ap_process:
            cmd = "ifconfig | grep ap0"
            out = subprocess.check_output(cmd, shell=True)
            if out:
               return True 
        return False 
