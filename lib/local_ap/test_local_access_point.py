##
# This should be a unit test, but just make sure its 
# up and makes sense for now
##

from LocalAcessPoint import LocalAccessPoint
import time

l_ap = LocalAcessPoint('waterbud', 'brianso1')
l_ap.create_ap()

# verify its up
time.sleep(5)
print l_ap.verify_is_up()

# kill and verify tis down
l_ap.kill_ap()
print l_ap.verify_is_up()
