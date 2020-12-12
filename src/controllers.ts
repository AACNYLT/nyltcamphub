import { Course, Evaluation, ICourse, IScout, Scout, ScoutType } from './models';

export async function getScoutWithCourse(scoutId: string): Promise<IScout | null> {
    return await Scout.findById(scoutId).populate({
        path: 'course',
        model: 'Course',
        populate: {
            path: 'participants',
            model: 'Scout'
        }
    }).populate({
        path: 'course',
        model: 'Course',
        populate: {
            path: 'staff',
            model: 'Scout'
        }
    }).exec();
}

export async function getScoutWithAuthoredEvaluations(scoutId: string): Promise<IScout | null> {
    return await Scout.findById(scoutId).populate('evaluationsAsAuthor').exec();
}

export async function getScoutWithTheirEvaluations(scoutId: string): Promise<IScout | null> {
    return await Scout.findById(scoutId).populate('evaluationsAsSubject').exec();
}

export async function getScout(scoutId: string): Promise<IScout | null> {
    return await Scout.findById(scoutId).exec();
}

export async function getCourse(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId).exec();
}

export async function createEvaluation(authorId: string, subjectId: string, evaluationJson: any): Promise<IScout | null> {
    evaluationJson.scout = subjectId;
    evaluationJson.author = authorId;
    const evaluation = new Evaluation(evaluationJson);
    const subject = await getScoutWithTheirEvaluations(subjectId);
    const author = await getScoutWithAuthoredEvaluations(authorId);
    author?.evaluationsAsAuthor.push(evaluation);
    subject?.evaluationsAsSubject.push(evaluation);
    await evaluation.save();
    await author?.save();
    await subject?.save();
    return subject;
}

export async function createScout(scoutJson: any, courseId: string, scoutType: ScoutType): Promise<IScout> {
    scoutJson.course = courseId;
    const scout = new Scout(scoutJson);
    const course = await getCourse(courseId);
    switch (scoutType) {
        case ScoutType.Participant:
            course?.participants.push(scout);
            break;
        case ScoutType.Staff:
            course?.staff.push(scout);
            break;
    }
    await scout.save();
    await course?.save();
    return scout;
}

export async function createCourse(courseJson: any): Promise<ICourse> {
    const course = new Course(courseJson);
    await course.save();
    return course;
}