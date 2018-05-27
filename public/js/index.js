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

socketIo.on('newLocationMessage',function(message){
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My Current Location</a>');
	li.text(`${message.from}: `);
	a.attr('href',message.url);
	li.append(a);
	jQuery('#messages').append(li); 
});

jQuery('#message-form').on('submit',function(e){
	e.preventDefault();
	socketIo.emit('createMessage',{
		from:'User',
		text:$('[name=message]').val()
	},function(){

	});
});

var locationButton = $('#send-location');
locationButton.on('click',function(){
	if(navigator.geolocation){
		return alert('Geolocation not supported by your browser');
	}

	navigator.geolocation.getCurrentPosition(function(position){
		socketIo.emit('createLocationMessage',{
			latitude:position.coords.latitude,
			longitude:position.coords.longitude
		});
	},function(){
		alert('unable to fetch location');
	});
});
