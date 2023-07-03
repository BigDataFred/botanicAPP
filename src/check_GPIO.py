# import libraries
import RPi.GPIO as GPIO
from time import sleep
import smtplib

GPIO.setmode(GPIO.BOARD)# GPIO numbering

GPIO.setup(37,GPIO.IN)# setup Input
GPIO.setup(38,GPIO.OUT)# setup Output


smtp_usr = "fredericrouxw@gmail.com"
smtp_pwd =  "1401SARITa"
smtp_host = "Smtp.gmail.com"
smtp_port = 465

smtp_sender = "example"
smtp_receivers = ["example","example"]


message = "hi i am a bit thirsty. can you please give me some water?"

def sendEmail(smtp_message):
	try:
		smtpObj = smtplib.SMTP_SSL(smtp_host, smtp_port)
		smtpObj.ehlo()
		smtpObj.login(smtp_usr, smtp_pwd)
		smtpObj.sendmail(smtp_sender, smtp_receivers,smtp_message)
		smtpObj.quit()

	except smtplib.SMTPException:
		print "Error sending email"


try:
	while True:
		# if pin is high (moisture level is low)
		if GPIO.input(37) == True:
			print "Moisture level low"
			sleep(.5)
		# if pin is low (moisture level high)
		else:
			print "Moisture level high"
			sendEmail( message )
			sleep(10)
finally:
	GPIO.cleanup()
