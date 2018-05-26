const path = require('path');
const express = require('express');
const publicPath = path.join(__dirname,'../public');
var app = express();
app.use(express.static(publicPath));

const port = process.env.PORT ||2005;

app.listen(port,function(){
	console.log('Server Listening on port '+port);
});