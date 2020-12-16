import express from 'express';
import {
    createCourse,
    createEvaluation,
    createScout,
    deleteCourse,
    deleteEvaluation,
    deleteScout,
    getScoutWithAuthoredEvaluations,
    getScoutWithCourse,
    updateCourse,
    updateEvaluation,
    updateScout
} from './database.controllers';
import { ScoutType } from './models';
import { checkPermission, createTokenForUser, getEvaluationsForScout, getUserIdFromToken } from './route.controllers';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const token = await createTokenForUser(req.body.firstName, req.body.lastName, req.body.dateOfBirth);
        if (token) {
            res.send(token);
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.use((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] ?? '';
    try {
        const userId = getUserIdFromToken(token);
        if (userId) {
            // @ts-ignore
            req.userId = userId;
            next();
        } else {
            res.sendStatus(401);
        }
    } catch {
        res.sendStatus(401);
    }
});


router.get('/scout', async (req: any, res) => {
    try {
        const scout = await getScoutWithAuthoredEvaluations(req.userId);
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

router.route('/scout/:scoutId')
    .get(async (req: any, res) => {
        try {
            const scout = await getEvaluationsForScout(req.params.scoutId, req.userId);
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
    .put(async (req: any, res) => {
        try {
            if (await checkPermission(req.userId, 4)) {
                const scout = await updateScout(req.params.scoutId, req.body);
                if (scout !== null) {
                    res.json(scout);
                } else {
                    res.status(404).send('Scout not found');
                }
            } else {
                res.sendStatus(401);
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })
    .delete(async (req: any, res) => {
        try {
            if (await checkPermission(req.userId, 4)) {
                await deleteScout(req.params.scoutId);
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })

router.post('/scout/:scoutId/evaluations/author/:authorId', async (req, res) => {
    try {
        res.json(await createEvaluation(req.params.authorId, req.params.scoutId, req.body));
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.route('/course')
    .get(async (req: any, res) => {
        try {
            const scout = await getScoutWithCourse(req.userId);
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
    .post(async (req: any, res) => {
        try {
            if (await checkPermission(req.userId, 4)) {
                res.json(await createCourse(req.body));
            } else {
                res.sendStatus(401);
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    });

router.route('/course/:courseId')
    .put(async (req: any, res) => {
        try {
            if (await checkPermission(req.userId, 4)) {
                const course = await updateCourse(req.params.courseId, req.body);
                if (course !== null) {
                    res.json(course);
                } else {
                    res.status(404).send('Course not found');
                }
            } else {
                res.sendStatus(401);
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })
    .delete(async (req: any, res) => {
        try {
            if (await checkPermission(req.userId, 4)) {
                await deleteCourse(req.params.courseId);
                res.sendStatus(200);
            }
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