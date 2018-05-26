var socketIo = io();
socketIo.on('connect',function (){
	console.log('connected');

	/*socketIo.emit('createEmail',{
		to:'jen@example.com',
		text:'this is andrew'
	});*/

	/*socketIo.emit('createMessage',{
		from:"kamal",
		text:"this works for me"
	});*/
});
socketIo.on('disconnect',function (){
	console.log('disconnected');
});

/*socketIo.on('newEmail',function(email){
	console.log('new email',email);
});*/

socketIo.on('newMessage',function(newMessage){
	console.log('newMessage',newMessage);
});