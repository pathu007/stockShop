const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/stock-shop'));

app.listen(process.env.PORT || 8080);
app.get('/*', function(req,res) {

	console.log(__dirname);
    
res.sendFile(path.join(__dirname + '/dist/stock-shop/index.html'));
})

// Start the app by listening on the default Heroku port
console.log('Console is listening');