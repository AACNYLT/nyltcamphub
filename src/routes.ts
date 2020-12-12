import express from 'express';
import { getScoutWithAuthoredEvaluations, getScoutWithCourse, getScoutWithTheirEvaluations } from './controllers';

const router = express.Router();

router.get('/scout/:scoutId/course', async (req, res) => {
    try {
        const scout = getScoutWithCourse(req.params.scoutId);
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
        const scout = getScoutWithAuthoredEvaluations(req.params.scoutId);
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

router.get('/scout/:scoutId/evaluations/subject', async (req, res) => {
    try {
        const scout = getScoutWithTheirEvaluations(req.params.scoutId);
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