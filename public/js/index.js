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
	/*
	var li = jQuery('<li></li>');
	li.text(`${newMessage.from} ${formattedTime}:${newMessage.text}`);
	jQuery('#messages').append(li);*/

	var formattedTime = moment(newMessage.createdAt).format('h:mm a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template,{
		text:newMessage.text,
		from:newMessage.from,
		createdAt:formattedTime
	});

	jQuery('#messages').append(html);
});	


/*socketIo.emit('createMessage',{
	from:"frank",
	text:"hi"
},function(){
	console.log('got it');
});*/

socketIo.on('newLocationMessage',function(message){
	var formattedTime = moment(message.createdAt).format('h:mm a');

	/*var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My Current Location</a>');
	li.text(`${message.from} ${formattedTime}: `);
	a.attr('href',message.url);
	li.append(a);*/
	var locationTemplate = jQuery('#location-message-template').html();
	var html = Mustache.render(locationTemplate,{
		url:message.url,
		from:message.from,
		createdAt:formattedTime
	});
	jQuery('#messages').append(html); 
});

jQuery('#message-form').on('submit',function(e){
	var messageTextBox = jQuery('[name=message]');
	e.preventDefault();
	socketIo.emit('createMessage',{
		from:'User',
		text:messageTextBox.val()
	},function(){
		messageTextBox.val('');
	});
});

var locationButton = $('#send-location');
locationButton.on('click',function(){
	if(navigator.geolocation){
		return alert('Geolocation not supported by your browser');
	}

	locationButton.attr('disabled','disabled').text('sending..');

	navigator.geolocation.getCurrentPosition(function(position){
		locationButton.removeAttr('disabled').text('Send Location');
		socketIo.emit('createLocationMessage',{
			latitude:position.coords.latitude,
			longitude:position.coords.longitude
		});
	},function(){
		locationButton.removeAttr('disabled').text('Send Location');
		alert('unable to fetch location');
	});
});
