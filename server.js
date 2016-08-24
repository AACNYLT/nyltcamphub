var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var passport = require('passport');
var BasicStrategy = require('passport-http');

var Scout = require('./scout.js');
var Evaluation = require('./evaluation.js');
var Interview = require('./interview.js');
var Course = require('./course.js');

var apirouter = require('./api.js');

var app = express();

///mongoose.connect('mongodb://api:camphub@ds030719.mlab.com:30719/CampHub_DB');
mongoose.connect('mongodb://localhost:27017');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
	.get(function(req,res){
		res.sendFile(path.join(__dirname,"/index.html"));
	});

app.route('/authenticate')
	.get(function(req,res){
		if (req.query.barcode) {
			Scout.findOne({$or: [{BSAID: req.query.barcode},{ScoutID: req.query.barcode}]}).exec(function(err,scoutlist){
				if (err)
					res.send(err);
				else
					res.json(scoutlist);
			});
		} else if (req.query.username) {
			Scout.findOne({$and: [{Username: req.query.username}, {Password: req.query.password}]}).exec(function(err,scoutlist){
				if(err)
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