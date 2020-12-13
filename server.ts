import express from 'express';
import mongoose from 'mongoose';

import { DB_URL } from './src/constants';
import { Routes } from './src/routes';

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

mongoose.connect(DB_URL, {useNewUrlParser: true})
    .then(() => console.log('MongoDB Connected')).catch(err => console.error(err));

app.use('/api', Routes);

app.use('/', express.static('./static/build'));

const server = app.listen(process.env.PORT || 80, () => {
    // @ts-ignore
    console.log(`Server available on port ${server.address().port}`);
});
module.exports = server;