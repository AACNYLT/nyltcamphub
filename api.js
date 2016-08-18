var express = require('express');
var apirouter = express.Router();

apirouter.route('/scouts')
	.get(function(req,res){
		if (req.query.courseid) {
			Scout.find({CourseID: req.query.courseid}).exec(function(err,scoutlist){
				if (err)
					res.send(err);
				else
					res.json(scoutlist);
			});
		} else{
			Scout.find({}).exec(function(err,scoutlist){
				if(err)
					res.send(err);
				else
					res.json(scoutlist);
			});
		}
	})
	.post(function(req,res){
		var scout = new Scout(req.body);
		scout.save(function(err) {
            if (err)
                res.send(err);
            else
            	res.json({ message: 'Scout created.' });
        });
	})

apirouter.route('/scouts/:scoutid')
	.get(function(req,res){
		Scout.findOne({ScoutID: req.params.scoutid}).exec(function(err,scout){
			if (err)
				res.send(err);
			else
				res.json(scout);
		});
	})
	.put(function(req,res){
		Scout.update({ScoutID: req.params.scoutid}, req.body, {multi: false}, function(err){
			if (err)
				res.send(err);
			else
				res.json({message: 'Scout updated.'});
		});
	})
	.delete(function(req,res){
		Scout.remove({
           	ScoutID: req.params.scoutid
        }, function(err, scout) {
           	if (err)
               	res.send(err);
           	else {
           		if (req.query.deleteAll && req.query.deleteAll === "true"){
					Evaluation.remove({ScoutID: req.params.scoutid},function(err,evals){
						if (err)
							res.send(err);
						else {
							Interview.remove({ScoutID: req.params.scoutid}, function(err,interviews){
								if(err)
									res.send(err);
								else {
									fs.unlink(path.join(__dirname, "/images" + req.params.scoutid), function(err) {
										if(err)
											res.send(err);
										else {
											res.json({message: 'Successfully deleted'});
										}
									});
								}
							});
						}
					});
				} else {
           			res.json({ message: 'Successfully deleted' });
           		}
           	}
        });
	});

apirouter.route('/scouts/:scoutid/image')
	.get(function(req,res){
		res.sendFile(path.join(__dirname,"/images/" + req.params.scoutid));
	})
	.post(scout_image_uploads.single('scoutImage'),function(req,res){
		res.json({message: 'File uploaded.'});
	})
	.delete(function(req,res){
		fs.unlink(path.join(__dirname, "/images" + req.params.scoutid), function(err) {
			if(err)
				res.send(err);
			else {
				res.json({message: 'Successfully deleted'});
			}
		});
	});

apirouter.route('/scouts/:scoutid/evaluations')
	.get(function(req,res){
		if (req.query.evaluator) {
			Evaluation.find({$and: [{ScoutID: req.params.scoutid},{EvaluatorID: req.query.evaluator}]}).exec(function(err,evallist){
				if (err)
					res.send(err);
				else
					res.json(evallist);
			});
		} else if (req.query.day) {
			Evaluation.find({$and: [{ScoutID: req.params.scoutid},{Day: req.query.day}]}).exec(function(err,evallist){
				if (err)
					res.send(err);
				else
					res.json(evallist);
			});
		} else {
			Evaluation.find({ScoutID: req.params.scoutid}).exec(function(err,evallist){
				if (err)
					res.send(err);
				else
					res.json(evallist);
			});
		}
	});

apirouter.route('/scouts/:scoutid/interviews')
	.get(function(req,res){
		Interview.find({ScoutID: req.params.scoutid}).exec(function(err,interviewlist){
			if (err)
				res.send(err);
			else
				res.json(interviewlist);
		});
	});

apirouter.route('/scouts/:scoutid/team')
	.get(function(req,res){
		Scout.find({LeaderID: req.params.scoutid}).exec(function(err,scoutlist){
			if (err)
				res.send(err);
			else
				res.json(scoutlist);
		});
	});

apirouter.route('/scouts/:scoutid/activity')
	.get(function(req,res){

	});

apirouter.route('/scouts/:scoutid/activity/evaluations')
	.get(function(req,res){
		Evaluation.find({EvaluatorID: req.params.scoutid}).exec(function(err,evallist){
			if (err)
				res.send(err);
			else
				res.json(evallist);
		});
	});
	
apirouter.route('/scouts/:scoutid/activity/interviews')
	.get(function(req,res){
		Interview.find({Interviewer: req.params.scoutid}).exec(function(err,interviewlist){
			if (err)
				res.send(err);
			else
				res.json(interviewlist);
		});
	});

apirouter.route('/evaluations')
	.get(function(req,res){
		Evaluation.find({}).exec(function(err,evallist){
			if (err)
				res.send(err);
			else
				res.json(evallist);
		});
	})
	.post(function(req,res){
		var evaluation = new Evaluation(req.body);
		evaluation.save(function(err) {
            if (err)
                res.send(err);
			else
            	res.json({ message: 'Evaluation created.' });
        });
	});

apirouter.route('/evaluations/:objectid')
	.get(function(req,res){
		Evaluation.findOne({EvalID: req.params.objectid},function(err,eval){
			if (err)
				res.send(err);
			else
				res.json(eval);
		});		
	})
	.put(function(req,res){
		Evaluation.update({EvalID: req.params.objectid}, req.body, {multi: false}, function(err){
			if (err)
				res.send(err);
			else
				res.json({message: 'Evaluation updated.'});
		});
	})
	.delete(function(req,res){
		Evaluation.remove({
            EvalID: req.params.objectid
        }, function(err, evaluation) {
            if (err)
                res.send(err);
            else
            	res.json({ message: 'Successfully deleted' });
        });
	});

apirouter.route('/interviews')
	.get(function(req,res){
		Interview.find({}).exec(function(err,interviewlist){
			if (err)
				res.send(err);
			else
				res.json(interviewlist);
		});
	})
	.post(function(req,res){
		var interview = new Interview(req.body);
		interview.save(function(err) {
            if (err)
                res.send(err);
            else
            	res.json({ message: 'Interview created.' });
        });
	});

apirouter.route('/interviews/:objectid')
	.get(function(req,res){
		Interview.findOne({InterviewID: req.params.objectid},function(err,interview){
			if (err)
				res.send(err);
			else
				res.json(interview);
		});		
	})
	.put(function(req,res){
		Interview.update({InterviewID: req.params.objectid}, req.body, {multi: false}, function(err){
			if (err)
				res.send(err);
			else
				res.json({message: 'Interview updated.'});
		});
	})
	.delete(function(req,res){
		Interview.remove({
            InterviewID: req.params.objectid
        }, function(err, interview) {
            if (err)
                res.send(err);
            else
            	res.json({ message: 'Successfully deleted' });
        });
	});

apirouter.route('/courses')
	.get(function(req,res){
		Course.find({}).exec(function(err,courselist){
			if (err)
				res.send(err);
			else
				res.json(courselist);
		});
	})
	.post(function(req,res){
		var course = new Course(req.body);
		course.save(function(err) {
            if (err)
                res.send(err);
            else
            	res.json({ message: 'Course created.' });
        });
	});

apirouter.route('/courses/:courseid')
	.get(function(req,res){
		Course.findOne({'CourseID': req.params.courseid}).exec(function(err,course){
			if (err)
				res.send(err);
			else
				res.json(course);
		});
	})
	.put(function(req,res){

	})
	.delete(function(req,res){
		//deleteAll param
		Course.remove({
            CourseID: req.params.courseid
        }, function(err, course) {
            if (err)
                res.send(err);
            else
            	res.json({ message: 'Successfully deleted' });
        });
	});

module.exports = apirouter;