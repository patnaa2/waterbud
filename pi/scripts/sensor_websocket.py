import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web

LOCAL_HOST = ["127.0.0.1", "::1"]

class WSModHandler(tornado.websocket.WebSocketHandler):
    wc_clients = [] 
    DEBUG = True

    # Need to override 403 security error 
    def check_origin(self, origin):
        return True

    def open(self):
        if self not in self.wc_clients:
            self.wc_clients.append(self)
        if self.DEBUG:
            print "New Connection was opened"

    def on_message(self, message):
        if self.DEBUG:
            print 'Incoming message: %s' %(message)
        
        # only write if the data was updated locally 
        # pi's current remote_ip is beign picked up 
        # as ::1
        if self.request.remote_ip in LOCAL_HOST:
            if type(message) != str:
                try:
                    # try to stringify
                    message = str(message)
                except:
                    message = "Invalid message format sent to websocket"
            for w in self.wc_clients:
                w.write_message(message)

    def on_close(self):
        if self.DEBUG:
            print "Goodbye. Thanks for listening."
        try:
            self.wc_clients.remove(self)
        # if for some reason a remove fails, we don't want to die
        except:
            pass

app = tornado.web.Application([
    (r'/ws', WSModHandler),
])

if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
