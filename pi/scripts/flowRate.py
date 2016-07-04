#!/usr/bin/env python

import RPi.GPIO as GPIO
import time, sys


oldTime = int(time.time() * 1000)
totalMilliLitres= 0
calibrationFactor = 4.5;

FLOW_SENSOR = 22

GPIO.setmode(GPIO.BCM)
GPIO.setup(FLOW_SENSOR, GPIO.IN, pull_up_down = GPIO.PUD_UP)

global count
count = 0

def countPulse(channel):
   global count
   count = count+1
   # print count

GPIO.add_event_detect(FLOW_SENSOR, GPIO.FALLING, callback=countPulse)

while True:
    try:
    	currentTime = int(time.time() * 1000)
        if((currentTime - oldTime) > 1000):
        	flowRate = ((1000.0 / (currentTime - oldTime)) * count) / calibrationFactor
        	flowMilliLitres = (flowRate / 60) * 1000
        	totalMilliLitres += flowMilliLitres
        	if (flowMilliLitres > 0):
        		print "Rate: ", flowRate
        		print "Total: ", totalMilliLitres
        	oldTime = int(time.time() * 1000)
        	count = 0

    except KeyboardInterrupt:
        print '\nKeyboard interrupt!\nExiting!'
        GPIO.cleanup()
        sys.exit()