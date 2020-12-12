import express from 'express';
import {
    createCourse,
    createEvaluation,
    createScout, deleteCourse, deleteEvaluation, deleteScout,
    getAllCourses,
    getCourse,
    getScout,
    getScoutWithAuthoredEvaluations,
    getScoutWithCourse,
    getScoutWithTheirEvaluations, updateCourse, updateEvaluation, updateScout
} from './controllers';
import { ScoutType } from './models';

const router = express.Router();

router.route('/scout/:scoutId')
    .get(async (req, res) => {
        try {
            const scout = await getScout(req.params.scoutId);
            if (scout !== null) {
                res.json(scout);
            } else {
                res.status(404).send('Scout not found');
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })
    .put(async (req, res) => {
        try {
            const scout = await updateScout(req.params.scoutId, req.body);
            if (scout !== null) {
                res.json(scout);
            } else {
                res.status(404).send('Scout not found');
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })
    .delete(async (req, res) => {
        try {
            await deleteScout(req.params.scoutId);
            res.sendStatus(200);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })

router.get('/scout/:scoutId/course', async (req, res) => {
    try {
        const scout = await getScoutWithCourse(req.params.scoutId);
        if (scout !== null) {
            res.json(scout);
        } else {
            res.status(404).send('Scout not found');
        }
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.get('/scout/:scoutId/evaluations/author', async (req, res) => {
    try {
        const scout = await getScoutWithAuthoredEvaluations(req.params.scoutId);
        if (scout !== null) {
            res.json(scout);
        } else {
            res.status(404).send('Scout not found');
        }
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.post('/scout/:scoutId/evaluations/author/:authorId', async (req, res) => {
    try {
        res.json(await createEvaluation(req.params.authorId, req.params.scoutId, req.body));
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.get('/scout/:scoutId/evaluations', async (req, res) => {
    try {
        const scout = await getScoutWithTheirEvaluations(req.params.scoutId);
        if (scout !== null) {
            res.json(scout);
        } else {
            res.status(404).send('Scout not found');
        }
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.route('/course')
    .get(async (req, res) => {
        try {
            res.json(await getAllCourses());
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })
    .post(async (req, res) => {
        try {
            res.json(await createCourse(req.body));
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    });

router.route('/course/:courseId')
    .get(async (req, res) => {
        try {
            const course = await getCourse(req.params.courseId);
            if (course !== null) {
                res.json(course);
            } else {
                res.status(404).send('Course not found');
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })
    .put(async (req, res) => {
        try {
            const course = await updateCourse(req.params.courseId, req.body);
            if (course !== null) {
                res.json(course);
            } else {
                res.status(404).send('Course not found');
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })
    .delete(async (req, res) => {
        try {
            await deleteCourse(req.params.courseId);
            res.sendStatus(200);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    });

router.post('/course/:courseId/scout/:scoutType', async (req, res) => {
    try {
        const scoutType = req.params.scoutType.toLowerCase() === 'staff' ? ScoutType.Staff : ScoutType.Participant;
        res.json(await createScout(req.body, req.params.courseId, scoutType));
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.route('/evaluation/:evaluationId')
    .put(async (req, res) => {
        try {
            const evaluation = await updateEvaluation(req.params.evaluationId, req.body);
            if (evaluation !== null) {
                res.json(evaluation);
            } else {
                res.status(404).send('Evaluation not found');
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })
    .delete(async (req, res) => {
        try {
            await deleteEvaluation(req.params.evaluationId);
            res.sendStatus(200);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    });


export { router as Routes };