#!/usr/bin/env python

import socket
import os

# connects socket to PixPro and sends HTTP GET message
def init_socket():
    global s, TCP_IP, TCP_PORT, MESSAGE
    s.connect((TCP_IP, TCP_PORT))
    s.send(MESSAGE)

# read a line from the socket
def read_line(sock):
    chars = []
    while True:
        a = sock.recv(1)
        chars.append(a)     
        if a == "\n" or a == "":
            return "".join(chars)

# Writes the image to .jpg file
def write_image_to_file():
    global s, HEADER_CONTENT_LENGTH
    curr_line = read_line(s)
    if HEADER_CONTENT_LENGTH in curr_line:
        file_size = int(''.join(x for x in curr_line if x.isdigit()))
        curr_line = read_line(s)
        img = s.recv(file_size, socket.MSG_WAITALL)
        f = open('workfile.jpg', 'w')
        f.write(img)
        f.close()
        os.rename('workfile.jpg', 'image.jpg')            

# PixPro Information
TCP_IP = '172.16.0.254'
TCP_PORT = 9176

MESSAGE = "GET /index.html"
HEADER_CONTENT_LENGTH = "Content-length"

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
init_socket()

while True:
    write_image_to_file()
