const path = require('path');
const http = require('http');
const express = require('express');

const socket = require('socket.io');
const publicPath = path.join(__dirname,'../public');
var app = express();

var server = http.createServer(app)
var io = socket(server);

app.use(express.static(publicPath));

io.on('connection',(socketIo)=>{
	console.log('New User connected');

	socketIo.on('disconnect',()=>{
		console.log('user disconnected');
	});
});
const port = process.env.PORT ||2005;

server.listen(port,function(){
	console.log('Server Listening on port '+port);
});