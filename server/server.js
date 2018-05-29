const path = require('path');
const http = require('http');
const express = require('express');
const {generateMessage,generateLocationMessage} = require('./utils/messages');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const socket = require('socket.io');
const publicPath = path.join(__dirname,'../public');
var app = express();

var server = http.createServer(app)
var io = socket(server);
var users = new Users();

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

	socketIo.on('join',(params,callback)=>{
		if(!isRealString(params.name) || !isRealString(params.room)){
			return callback('Name and room name are required');
		}

		socketIo.join(params.room);
		users.removeUser(socketIo.id);
		users.addUser(socketIo.id,params.name,params.room);
		//socket.leave('the Office fans');
		//io.emit --> io.to('The office fans').emit
		//socket.broadcast.emit --> socket.broadcast.to('The Office fans!')
		io.to(params.room).emit('updateUserList',users.getUserList(params.room));
		socketIo.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
		socketIo.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
		callback();
	});

	socketIo.on('createMessage',(message,callback)=>{
		console.log('createMessage',message); 
		/*io.emit('newMessage',{
			from:message.from,
			text:message.text,
			createAt: new Date().getTime()
		});*/
		io.emit('newMessage',generateMessage(message.from,message.text));
		callback();
	});

	socketIo.on('createLocationMessage',(coords)=>{
		io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude))
	});
	socketIo.on('disconnect',()=>{
		var user = users.removeUser(socketIo.id);
		if(user){
			io.to(user.room).emit('updateUserList',users.getUserList(user.room));
			io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
		}
	});
});
const port = process.env.PORT ||2005;

server.listen(port,function(){
	console.log('Server Listening on port '+port);
});