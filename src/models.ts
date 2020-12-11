import mongoose, { Schema, Document } from 'mongoose';
import exp from 'constants';

export interface IScout extends Document {
    FirstName: string,
    LastName: string,
    Gender: string,
    DateOfBirth: string,
    ScoutID: number,
    BSAID: number,
    Username: string,
    Password: string,
    Position: string,
    Team: string,
    IsAdmin: boolean,
    IsYouth: boolean,
    IsElevated: boolean,
    IsStaff: boolean,
    CourseName: string,
    CourseID: number,
    LastModified: Date,
    Created: Date
}

const ScoutSchema: Schema = new Schema({
    FirstName: String,
    LastName: String,
    Gender: String,
    DateOfBirth: String,
    ScoutID: Number,
    BSAID: Number,
    Username: String,
    Password: String,
    Position: String,
    Team: String,
    IsAdmin: Boolean,
    IsYouth: Boolean,
    IsElevated: Boolean,
    IsStaff: Boolean,
    CourseName: String,
    CourseID: Number,
    LastModified: Date,
    Created: Date
});

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
});

const Course = mongoose.model<ICourse>('Course', CourseSchema);

export { Scout, Evaluation, Course };