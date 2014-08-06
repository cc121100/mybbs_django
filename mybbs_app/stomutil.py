import time
import sys

import stomp

class MyListener(object):
    def on_error(self, headers, message):
        print('received an error %s' % message)
    def on_message(self, headers, message):
        print('received a message %s' % message)


def sendMsg(msg):
    print 'msg: %s' %msg
    conn = stomp.Connection()
    conn.set_listener('', MyListener())
    conn.start()
    conn.connect()
    
    #conn.subscribe(destination='/queue/jmsQueue', id=1, ack='auto')
    
    conn.send(message=msg, destination='/queue/jmsQueue')
    
    conn.disconnect()