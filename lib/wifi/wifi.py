from subprocess import check_output 

class CurrentWifi(object):
    '''
        Helper class used to determine wifi settings for current computer
        As far as I can tell (with my testing) this only works on Nix machines
        100% sure it doesn't work on Windows (wifi credentials are stored in 
        registry files)

        Future improvements: 
            - All the methods in this class are not OS independent, need to 
              create code blocks for various OS 
            - Test on phones
    '''
    def __init__(self):
        self.ssid = None
        self.password = None

    def get_current_ssid(self):
        if not self.ssid:
            cmd = "iwgetid -r"
            self.ssid = check_output(cmd, shell=True).strip('\n')
            if not self.ssid:
                msg = "CRITICAL:: Not Connected To Internet"
                raise Exception(msg)

    def get_current_password(self):
        # HACK Anshuman Jun 28, 2016:
        # I am assuming that the next layer takes care of ensuring
        # that the following method is always called as sudo, since messing
        # with the permissions of NetworkManager and other system files
        # is generally bad practice

        if not self.password:
            if not self.ssid:
                self.get_current_ssid()
            cmd = "sudo grep -e '^psk=' /etc/NetworkManager/system-connections"\
                  "/%s" %(self.ssid)
            self.password = check_output(cmd, 
                                         shell=True).split('=')[1].strip('\n')

    def write_values_to_file(self, f):
        # f is a file-stream object 
        if f.mode == 'w':
            if not self.password:
                self.get_current_password()
            data = "SSID: %s\nSSID_PASSWORD: %s" %(self.ssid,
                                                   self.password)
            f.write(data)
        else:
            msg = "File Stream must be opened with write option"
            raise AttributeError(msg)
