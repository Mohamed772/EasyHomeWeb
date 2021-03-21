const express = require("express");
const app = express();
const fs = require("fs");
const morgan = require("morgan");
var nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const { hostname } = require("os");

const PORT = 3000;

app.use(express.static("public"));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.sendFile("./src/home.html", { root: __dirname });
});

app.post("/sendEmail", (req, res) => {
	const email = req.body.email;
	const data = req.body.data;
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "easyhome.gang@gmail.com",
			pass: "verysecurepassword",
		},
	});

	let mailOptions = {
		from: "easyhome.gang@gmail.com",
		to: email,
		subject: "Your search on easyHome.com !",
		text: `Here is a link to open your search again: http://${req.hostname}/?save=${data}`,
	};

	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log(err);
			res.status(500).send("Server Error !");
		} else {
			console.log("Email send successfully !");
			res.send("Email send !")
		}
	});
});

app.listen(PORT, () =>
	console.log(`App available on http://localhost:${PORT}/`)
);
