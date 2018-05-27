const path = require('path');
const http = require('http');
const express = require('express');
const {generateMessage,generateLocationMessage} = require('./utils/messages');

const socket = require('socket.io');
const publicPath = path.join(__dirname,'../public');
var app = express();

var server = http.createServer(app)
var io = socket(server);

app.use(express.static(publicPath));

io.on('connection',(socketIo)=>{
	console.log('New User connected');

	/*socketIo.emit('newEmail',{
		from:'mike@example.com',
		text:'Hey,what is going on',
		createAt : '123'
	});*/

	/*socketIo.emit('newMessage',{
		from:"server",
		text:"hahah"
	});*/

	/*socketIo.on('createEmail',(newEmail)=>{
		console.log('createEmail',newEmail);
	});*/

	 socketIo.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
	 socketIo.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));
	socketIo.on('createMessage',(message,callback)=>{
		console.log('createMessage',message); 
		/*io.emit('newMessage',{
			from:message.from,
			text:message.text,
			createAt: new Date().getTime()
		});*/
		socketIo.broadcast.emit('newMessage',generateMessage(message.from,message.text));
		callback();
	});

	socketIo.on('createLocationMessage',(coords)=>{
		io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude))
	});
	socketIo.on('disconnect',()=>{
		console.log('user disconnected');
	});
});
const port = process.env.PORT ||2005;

server.listen(port,function(){
	console.log('Server Listening on port '+port);
});