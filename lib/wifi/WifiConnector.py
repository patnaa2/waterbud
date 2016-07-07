from CurrentWifi import CurrentWifi
from subprocess import check_output

class WifiConnector(object):

    def __init__(self, ssid=None, password=None):
        self.ssid = ssid
        self.password = password
        self.cw = CurrentWifi()

    def connect(self):
        if not ssid or not password:
            msg = "Not enough Credentials passed in"
            raise Exception(msg)
        
        if not self.is_connection():
            # check to make sure we are not connected to
            # something else
            if self.cw.get_current_ssid():
                ###
                # Insert Disconnect Logic here
                ###
                pass
            
            cmd = "nmcli -w 5 device wifi connect '%s' password '%s'" \
                    %(self.ssid, self.password)
            out = subprocess.check_output(cmd, shell=True)
            
    def check_connection(self, verbose=False):
        '''
            Helper method to check if connected the ssid specified 
            in the instance
            
            Since for Waterbud purposes, we will be creating some
            local networks (without any access to internet), we can't have
            a more comprehensive check (ie. pinging google or something)

            Future Improvement -> add a flag to indicate if we are connecting
            to a local or private network
        '''
        if self.ssid == self.cw.get_current_ssid():
            if verbose:
                print "Already Connected to %s" %(self.ssid)
            return True 
        return False
    
    @classmethod
    def get_wifi_signals(cls, device, limit=None):
        '''
            Returns a set of available ssids in the near
            range as detected for the given device
        '''
        cmd = 'sudo iwlist wlp2s0 scan | grep "ESSID" | awk -F ":" \'{print $2}\'' 
        out = check_output(cmd, shell=True)
        return set([x for x in out.split("\n") if x])

