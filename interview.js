var mongoose = require('mongoose');
Schema = mongoose.Schema;

var Interview = new Schema({
	InterviewID: String,
	ScoutID: Number,
	Created: String,
	LastModified: String,
	Year: Number,
	Interviewer: Number,
	TG: Boolean,
	QM: Boolean,
	STG: Boolean,
	ASPLS: Boolean,
	ASPLP: Boolean,
	ASPLT: Boolean,
	SPL: Boolean,
	WhyPosition: String,
	TrainingCommit: Boolean,
	SessionsDesired: String,
	HowEnsurePreparation: String,
	ReturningStaffer: Boolean,
	PreviousPerformance: Number,
	Poise: Number,
	Vision: Number,
	Spirit: Number,
	Potential: Number,
	RecommendedPosition: String,
	Comments: String,
	UniformAppearance: Number,
	PresentationPerformance: Number,
	Preparation: Number,
	Attitude: Number,
	ProgramUnderstanding: Number,
	YearsAsStaff: Number,
	InterviewTeamID: String
});

module.exports = mongoose.model('Interview',Interview);