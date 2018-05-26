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
	var li = jQuery('<li></li>');
	li.text(`${newMessage.from}:${newMessage.text}`);
	jQuery('#messages').append(li);
});	


/*socketIo.emit('createMessage',{
	from:"frank",
	text:"hi"
},function(){
	console.log('got it');
});*/

jQuery('#message-form').on('submit',function(e){
	e.preventDefault();
	socketIo.emit('createMessage',{
		from:'User',
		text:$('[name=message]').val()
	},function(){

	});
});