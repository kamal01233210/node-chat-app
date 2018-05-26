var expect = require('expect');

var {generateMessage} = require('./messages');

describe('generateMessage',()=>{
	it('should generate the correct message object',()=>{

		var from ='Jen';
		var text = "some message";

		var message = generateMessage(from,text);
		expect(message.createdAt).toBe('number');
		expect(message).toInclude({
			from,
			text
		});		
	});
});