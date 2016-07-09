##
# This should be a unit test, but just make sure its 
# up and makes sense for now
##

from LocalAccessPoint import LocalAccessPoint
import time

l_ap = LocalAccessPoint('waterbud', 'brianso1')
l_ap.create_ap()

# verify its up
time.sleep(5)
print l_ap.verify_ap_is_up()

val = ""
while val != "exit":
    print "Enter exit to kill the access point"
    val = raw_input()

# kill and verify tis down
l_ap.kill_ap()
print l_ap.verify_ap_is_up()
