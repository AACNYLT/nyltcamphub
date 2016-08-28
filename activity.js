var mongoose = require('mongoose');
Schema = mongoose.Schema;

var Activity = new Schema({
	ScoutID: Number,
    TargetID: Number,
	AttachmentType: String,
    Action: String,
    AttachedEval: {type: Schema.ObjectId, ref: 'Evaluation'},
    AttachedInterview: {type: Schema.ObjectId, ref: 'Interview'},
    Timestamp: Date
});

module.exports = mongoose.model('Activity',Activity);