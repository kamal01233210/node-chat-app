var socketIo = io();

function scrollToBottom(){
	//Selectors
	var messages = jQuery('#messages');
	var newMessage = messages.children('li:last-child');
	//Heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev();

	if(clientHeight + scrollTop+newMessageHeight+lastMessageHeight >= scrollHeight){
		messages.scrollTop(scrollHeight);
	}
}

socketIo.on('connect',function (){
	var params = jQuery.deparam(window.location.search);
	socketIo.emit('join',params,function(err){
		if(err){
			alert(err);
			window.location.href = '/';
		}else{
			console.log('No error');
		}
	});

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

socketIo.on('updateUserList',function(users){
	var ol = jQuery('<ol></ol>');
	users.forEach(function(user){
		ol.append(jQuery('<li></li>').text(user));
	});
	jQuery('#users').html(ol);
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
	scrollToBottom();
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
	scrollToBottom();
});

jQuery('#message-form').on('submit',function(e){
	var messageTextBox = jQuery('[name=message]');
	e.preventDefault();
	socketIo.emit('createMessage',{
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
