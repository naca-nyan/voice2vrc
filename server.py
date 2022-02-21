from http.server import SimpleHTTPRequestHandler, HTTPServer
from pythonosc import udp_client
import json

ip = '127.0.0.1'
port = 9090

vrcClientIp = '127.0.0.1'
vrcClientPort = 9000
client = udp_client.SimpleUDPClient(vrcClientIp, vrcClientPort)
def setOuter(isActive):
    client.send_message('/avatar/parameters/Outer', isActive)
def handleText(text):
    if "着る" in text or "切る" in text:
        setOuter(1)
    elif "脱ぐ" in text:
        setOuter(0)


class PostHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        content_len = int(self.headers['content-length'])
        post_body = self.rfile.read(content_len).decode('utf8')
        print(post_body)
        data = json.loads(post_body)
        self.send_response(200)
        if "text" in data:
            handleText(data['text'])


if __name__ == '__main__':
    HTTPServer((ip, port), PostHandler).serve_forever()
