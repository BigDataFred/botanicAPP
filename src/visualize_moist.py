
import matplotlib.pyplot as plt
import pickle
import time
import numpy as np
from sys import exit

pckl_file = "/home/pi/py/moisture_sensor/moist.pkl"
fig_file = '/home/pi/py/moisture_sensor/webapp/images/moist.png';

fig = plt.figure()

while (0 == 0):
    
    pckl = open(pckl_file,'rb')
    data = pickle.load(pckl)

    X = [row[0] for row in data]
    Y = [row[2] for row in data]
    L = [row[1] for row in data]

    plt.plot(X,Y,'-o',linewidth=2)
    plt.xlabel('Time [hrs]')
    plt.ylabel('Rel. Moisture [%]')

    ax=plt.gca()
    xt = X
    xt = xt[2::2]	
    ax.set_xticks(xt)
    for tick in ax.xaxis.get_major_ticks():
        tick.label.set_fontsize('x-small')
        tick.label.set_rotation('vertical')
    
    for i in range(len(L)):
        L[i]=str(round(L[i]*10)/10)    
    L = L[2::2]
    ax.set_xticklabels(L)
    #plt.xticks(str(L))

    fig.savefig(fig_file)
    
    time.sleep(900)# wait 15 min before refreshing plot
