const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const passport = require('passport');
const BasicStrategy = require('passport-http');

const Scout = require('./scout.js');
const Evaluation = require('./evaluation.js');
const Interview = require('./interview.js');
const Course = require('./course.js');

const apirouter = require('./api.js');

const app = express();

mongoose.connect('mongodb://api:camphub@ds030719.mlab.com:30719/CampHub_DB');
//mongoose.connect('mongodb://localhost:27017');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let compatInfo = {
	serverVersion: 1.2,
	minClientVersion: 3.6
};

/*passport.use(new BasicStrategy(
  function(username, password, done) {
    Scout.findOne({ Username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!(password === user.Password)) { return done(null, false); }
      return done(null, user);
    });
  }
));*/

app.route('/')
	.get(function (req, res) {
		res.sendFile(path.join(__dirname, "/index.html"));
	});

app.route('/policy')
	.get(function (req, res) {
		res.send("CampHub won't share any information transmitted through its app or stored on its servers, nor will that data be used for any other purpose beyond the services the app provides. The data will furthermore not be retained after it is deleted by the user.");
	});

app.route('/id')
	.get(function (req, res) {
		res.json(compatInfo);
	});

app.route('/authenticate')
	.get(function (req, res) {
		if (req.query.barcode) {
			Scout.findOne({ $or: [{ BSAID: req.query.barcode }, { ScoutID: req.query.barcode }] }).exec(function (err, scoutlist) {
				if (err)
					res.send(err);
				else
					res.json(scoutlist);
			});
		} else if (req.query.username) {
			Scout.findOne({ $and: [{ Username: req.query.username }, { Password: req.query.password }] }).exec(function (err, scoutlist) {
				if (err)
					res.send(err);
				else
					res.json(scoutlist);
			});
		} else {
			res.sendStatus(500);
		}
	});



app.use(apirouter);
app.use('/static', express.static(__dirname + '/static'));

var port = process.env.port || 80;

app.listen(port);
console.log('Server available on port ' + port);