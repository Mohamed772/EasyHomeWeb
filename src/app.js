const app = require('express')();

const PORT = 3000;

app.get('/', (req, res) => {
	res.send('Hello World !')
});

app.listen(PORT, () => console.log(`App available on http://localhost:${PORT}/`));