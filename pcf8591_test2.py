import time
import smbus
import pickle
import logging
import datetime
from genericpath import exists

import matplotlib.pyplot as plt
import numpy as np

bus = smbus.SMBus(1)

bus.write_byte(0x48,0) # i2cget -y 1
last_reading =-1

PICKLE_FILE = '/home/pi/py/moisture_sensor/moist.pkl'

def append_chart_point(chart,point):
    if len(chart) >= 96:
       np.delete(chart, range(24), axis=1)
    chart.append(point)
    return chart

def save(data):
    output = open(PICKLE_FILE,'wb')
    pickle.dump(data,output)
    output.close()

def load(default):
    if not exists(PICKLE_FILE):
        return default
    pcklfile = open(PICKLE_FILE,'rb')
    data = pickle.load(pcklfile)
    pcklfile.close()
    cnt=len(data)
    return data

logging.basicConfig(level=logging.INFO)

delta = datetime.timedelta(minutes=30)
next_time = datetime.datetime.now()

c1 = load([])
cnt=len(c1)
readings = []

while(0 == 0): # do forever
	
    dt = datetime.datetime.now()
    reading = bus.read_byte(0x48) # read A/D
    reading = reading*(3.3/255)
    reading = abs(reading/3.3-1)/0.5455
    readings.append(reading)
    
    print('analog reading: '+str(reading))
    time.sleep(60)
    
    if dt > next_time:
        cnt = cnt+1
        avg = round(sum(readings)/len(readings)*1000)/1000
        readings = []
        c1 = append_chart_point(c1, [cnt,float(dt.strftime('%H.%M')),avg])
        save(c1)
        next_time = dt + delta
        print( 'average: '+str(avg) )		
        time.sleep(30)
