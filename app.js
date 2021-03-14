const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');

const PORT = 3000;

app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.sendFile('./src/home.html', { root: __dirname });
});

app.listen(PORT, () =>
	console.log(`App available on http://localhost:${PORT}/`)
);
