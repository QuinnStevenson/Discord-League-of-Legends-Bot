const express = require('express');
const app = express()
const port = 3000;

app.use(express.static(__dirname));

console.log(__dirname);

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

app.get('/image', (req, res) => {
	res.sendFile(__dirname + '/image.html');
});

app.listen(port, (err) => {
	if(err) {
		return console.log('Server failed to start', err)
	}

	console.log(`Server is listening on ${port}`);
});