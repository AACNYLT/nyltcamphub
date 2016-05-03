var mongoose = require('mongoose');
Schema = mongoose.Schema;

var Course = new Schema({
	UnitName: String,
	CourseID: Number,
	StartDate: String
});

module.exports = mongoose.model('Course',Course);