import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web

class WSModHandler(tornado.websocket.WebSocketHandler):
    wc_clients = [] 

    # Need to override 403 security error 
    def check_origin(self, origin):
        return True

    def open(self):
        if self not in self.wc_clients:
            self.wc_clients.append(self)
        print "New Connection was opened"

    def on_message(self, message):
        print 'Incoming message: %s' %(message)
        
        # only write if the data was updated locally 
        if self.request.remote_ip == "127.0.0.1":
            for w in self.wc_clients:
                w.write_message("Message : %s" %(message))

    def on_close(self):
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
