import mongoose, { Schema, Document } from 'mongoose';

export interface IScout extends Document {
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    position: string,
    team: string,
    permissionLevel: number,
    imageUrl: string,
    course: ICourse['_id'],
    evaluationsAsAuthor: [IEvaluation['_id']],
    evaluationsAsSubject: [IEvaluation['_id']]
}

const ScoutSchema: Schema = new Schema({
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    position: String,
    team: String,
    permissionLevel: Number,
    imageUrl: String,
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    evaluationsAsAuthor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evaluation'
    }],
    evaluationsAsSubject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evaluation'
    }],
}, {timestamps: true});

const Scout = mongoose.model<IScout>('Scout', ScoutSchema)

export interface IEvaluation extends Document {
    scout: IScout['_id'],
    author: IScout['_id'],
    day: string,
    isFinal: boolean,
    knowledge: number,
    skill: number,
    motivation: number,
    confidence: number,
    enthusiasm: number,
    comments: string,
    recommend: number
}

const EvaluationSchema: Schema = new Schema({
    scout: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scout'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scout'
    },
    day: String,
    isFinal: Boolean,
    knowledge: Number,
    skill: Number,
    motivation: Number,
    confidence: Number,
    enthusiasm: Number,
    comments: String,
    recommend: Number
}, {timestamps: true});

const Evaluation = mongoose.model<IEvaluation>('Evaluation', EvaluationSchema);

export interface ICourse extends Document {
    unitName: string,
    startDate: Date,
    participants: [IScout['_id']],
    staff: [IScout['_id']]
}

const CourseSchema: Schema = new Schema({
    unitName: String,
    startDate: Date,
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scout'
    }],
    staff: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scout'
    }]
}, {timestamps: true});

const Course = mongoose.model<ICourse>('Course', CourseSchema);

export { Scout, Evaluation, Course };

export enum ScoutType {
    Staff,
    Participant
}