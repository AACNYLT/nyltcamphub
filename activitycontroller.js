var express = require('express');
var Activity = require('./activity.js');

var scope = {};

scope.addActivity = function(ScoutID, TargetID, AttachmentType, Action, Timestamp, AttachedEval, AttachedInterview){
    var activity = new Activity();
		activity.ScoutID = ScoutID;
		activity.TargetID = TargetID;
		activity.AttachmentType = AttachmentType;
		activity.Action = Action;
		activity.Timestamp = Timestamp;
		activity.AttachedEval = AttachedEval;
        activity.AttachedInterview = AttachedInterview;
		activity.save(function(err){
			if (err) {console.log(err);}
		});
};

scope.filterPost = function(item){
    if (item.Action == "POST") {return true;} else {return false;}
};

scope.filterPut = function(item){
    if (item.Action == "PUT") {return true;} else {return false;}
};

scope.filterGet = function(item){
    if (item.Action == "GET") {return true;} else {return false;}
};

scope.filterDelete = function(item){
    if (item.Action == "DELETE") {return true;} else {return false;}
};

module.exports = scope;