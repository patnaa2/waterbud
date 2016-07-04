pin 2: +5
pin 6: gnd
pin 15: GPIO port 22

sudo modprobe w1-gpio
sudo modprobe w1-therm

python flowRate.py