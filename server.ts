import * as express from 'express';

import * as Scout from './scout.js';
import * as Evaluation from './evaluation.js';
import * as Interview from './interview.js';
import * as Course from './course.js';

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());