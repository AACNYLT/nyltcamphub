var mongoose = require('mongoose');
Schema = mongoose.Schema;

var Evaluation = new Schema({
	EvalID: String,
	ScoutID: Number,
	Created: String,
	LastModified: String,
	LastModifiedBy: Number,
	EvaluatorPosition: String,
	EvaluatorID: Number,
	Day: String,
	IsFinal: Boolean,
	Knowledge: Number,
	Skill: Number,
	Motivation: Number,
	Confidence: Number,
	Enthusiasm: Number,
	Comments: String,
	Recommend: Number
});

module.exports = mongoose.model('Evaluation', Evaluation);