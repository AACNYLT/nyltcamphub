var mongoose = require('mongoose');
Schema = mongoose.Schema;

var Scout = new Schema({
	FirstName: String,
	LastName: String,
	Gender: String,
	DateOfBirth: String,
	ScoutID: Number,
	BSAID: Number,
	Username: String,
	Password: String,
	Position: String,
	Team: String,
	LeaderID: Number,
	IsAdmin: Boolean,
	IsYouth: Boolean,
	IsElevated: Boolean,
	IsStaff: Boolean,
	CourseName: String,
	CourseID: Number,
	LastModified: Date,
	Created: Date
});

module.exports = mongoose.model('Scout',Scout);