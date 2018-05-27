var expect = require('expect');

var {generateMessage,generateLocationMessage} = require('./messages');

describe('generateMessage',()=>{
	it('should generate the correct message object',()=>{

		var from ='Jen';
		var text = "some message";

		var message = generateMessage(from,text);
		expect(typeof message.createdAt).toBe('number');
		expect(message).toContain({from,text});		
	});
});

describe('generateLocationMessage',()=>{
	it('should generate current location',()=>{
		var from = 'Dev'	;
		var latitude = 15;
		var longitude = 19;
		var url = 'https//www.google.com/maps?q=15,19';
		var message = generateLocationMessage(from,latitude,longitude);
		expect(typeof message.createdAt).toBe('number');
		expect(message).toContain({from,url});
	});
});