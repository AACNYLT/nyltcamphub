import { Course, Evaluation, ICourse, IEvaluation, IScout, Scout, ScoutType } from './models';
import { createQueryName } from './utils';
import { filterEvaluations } from './route.controllers';
import { PermissionLevel } from './constants';

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
    return await Scout.findById(scoutId).populate({
        path: 'evaluationsAsAuthor',
        model: 'Evaluation',
        populate: {
            path: 'scout',
            model: 'Scout'
        }
    }).exec();
}

export async function getScoutWithTheirEvaluations(scoutId: string): Promise<IScout | null> {
    return await Scout.findById(scoutId).populate({
        path: 'evaluationsAsSubject',
        model: 'Evaluation',
        populate: {
            path: 'author',
            model: 'Scout'
        }
    }).exec();
}

export async function getScoutWithAllEvaluations(scoutId: string): Promise<IScout | null> {
    return await Scout.findById(scoutId).populate({
        path: 'evaluationsAsAuthor',
        model: 'Evaluation',
        populate: {
            path: 'scout',
            model: 'Scout'
        }
    }).populate({
        path: 'evaluationsAsSubject',
        model: 'Evaluation',
        populate: {
            path: 'author',
            model: 'Scout'
        }
    }).exec();
}

export async function getScoutWithEverything(scoutId: string): Promise<IScout | null> {
    return await Scout.findById(scoutId).populate('course').populate({
        path: 'evaluationsAsAuthor',
        model: 'Evaluation',
        populate: {
            path: 'scout',
            model: 'Scout'
        }
    }).populate({
        path: 'evaluationsAsSubject',
        model: 'Evaluation',
        populate: {
            path: 'author',
            model: 'Scout'
        }
    }).exec();
}

export async function getScout(scoutId: string): Promise<IScout | null> {
    return await Scout.findById(scoutId).exec();
}

export async function findScoutByNameAndBirthday(queryName: string, dateOfBirth: Date): Promise<IScout | null> {
    return await Scout.findOne({queryName: queryName, dateOfBirth: dateOfBirth}).exec();
}

export async function getCourse(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId).exec();
}

export async function getCourseWithScouts(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId).populate('participants').populate('staff').exec();
}

export async function getAllCourses(): Promise<ICourse[]> {
    return await Course.find({}).populate('participants').populate('staff').exec();
}

export async function getEvaluations(): Promise<IEvaluation[]> {
    return await Evaluation.find({}).populate({
        path: 'author',
        model: 'Scout',
        populate: {
            path: 'course',
            model: 'Course'
        }
    }).populate('scout').exec();
}

export async function createEvaluation(authorId: string, subjectId: string, evaluationJson: any): Promise<IScout | undefined> {
    evaluationJson.scout = subjectId;
    evaluationJson.author = authorId;
    const evaluation = new Evaluation(evaluationJson);
    const subject = await getScoutWithTheirEvaluations(subjectId);
    const author = await getScoutWithAuthoredEvaluations(authorId);
    if (subject && author) {
        author.evaluationsAsAuthor.push(evaluation);
        subject.evaluationsAsSubject.push(evaluation);
        await evaluation.save();
        await author.save();
        await subject.save();
        const updatedSubject = await subject.populate({
            path: 'evaluationsAsSubject',
            model: 'Evaluation',
            populate: {
                path: 'author',
                model: 'Scout'
            }
        }).execPopulate();
        return author.permissionLevel >= PermissionLevel.ADMIN ? updatedSubject : filterEvaluations(updatedSubject, authorId);
    } else {
        throw new Error('Unable to find author or subject');
    }
}

export async function createScout(scoutJson: any, courseId: string, scoutType: ScoutType): Promise<IScout> {
    scoutJson.course = courseId;
    scoutJson.queryName = createQueryName(scoutJson.firstName, scoutJson.lastName);
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

export async function createArrayOfScouts(scoutJsonArray: any[], courseId: string, scoutType: ScoutType): Promise<IScout[]> {
    const resultArray = [];
    for (let i = 0; i < scoutJsonArray.length; i++) {
        resultArray.push(await createScout(scoutJsonArray[i], courseId, scoutType));
    }
    return resultArray;
}

export async function createCourse(courseJson: any): Promise<ICourse> {
    const course = new Course(courseJson);
    await course.save();
    return course;
}

export async function deleteEvaluation(evaluationId: string, keepInSubjectList?: boolean, keepInAuthorList?: boolean) {
    const evaluation = await Evaluation.findById(evaluationId).populate('scout').populate('author').exec();
    if (evaluation) {
        if (!keepInSubjectList) await removeEvaluationAsSubject(evaluation.scout, evaluationId);
        if (!keepInAuthorList) await removeEvaluationAsAuthor(evaluation.author, evaluationId);
        await evaluation.remove();
    }
}

async function removeEvaluationAsAuthor(scout: IScout, evaluationId: string) {
    scout.evaluationsAsAuthor.splice(scout.evaluationsAsAuthor.indexOf(evaluationId), 1);
    await scout.save();
}

async function removeEvaluationAsSubject(scout: IScout, evaluationId: string) {
    scout.evaluationsAsSubject.splice(scout.evaluationsAsSubject.indexOf(evaluationId), 1);
    await scout.save();
}

export async function deleteScout(scoutId: string, keepInCourse?: boolean) {
    const scout = await getScoutWithEverything(scoutId);
    if (scout) {
        for (let i = 0; i < scout.evaluationsAsSubject.length; i++) {
            await deleteEvaluation(scout.evaluationsAsSubject[i]._id, true)
        }
        for (let i = 0; i < scout.evaluationsAsAuthor.length; i++) {
            await deleteEvaluation(scout.evaluationsAsAuthor[i]._id, false, true)
        }
        if (!keepInCourse) await removeScoutFromCourse(scout.course, scoutId);
        await scout.remove();
    }
}

async function removeScoutFromCourse(course: ICourse, scoutId: string) {
    const staffIndex = course.staff.indexOf(scoutId);
    const participantIndex = course.participants.indexOf(scoutId);
    if (staffIndex > participantIndex) {
        course.staff.splice(staffIndex, 1);
    } else {
        course.participants.splice(participantIndex, 1);
    }
    await course.save();
}

export async function deleteCourse(courseId: string) {
    const course = await getCourseWithScouts(courseId);
    if (course) {
        for (let i = 0; i < course.participants.length; i++) {
            await deleteScout(course.participants[i]._id, true);
        }
        for (let i = 0; i < course.staff.length; i++) {
            await deleteScout(course.staff[i]._id, true);
        }
        await course.remove();
    }
}

export async function updateEvaluation(evaluationId: string, evaluationJson: any): Promise<IEvaluation | null> {
    const evaluation = await Evaluation.findById(evaluationId).exec();
    if (evaluation) {
        evaluation.day = evaluationJson.day ?? evaluation.day;
        evaluation.knowledge = evaluationJson.knowledge ?? evaluation.knowledge;
        evaluation.skill = evaluationJson.skill ?? evaluation.skill;
        evaluation.confidence = evaluationJson.confidence ?? evaluation.confidence;
        evaluation.motivation = evaluationJson.motivation ?? evaluation.motivation;
        evaluation.enthusiasm = evaluationJson.enthusiasm ?? evaluation.enthusiasm;
        evaluation.comments = evaluationJson.comments ?? evaluation.comments;
        evaluation.recommend = evaluationJson.recommend ?? evaluation.recommend;
        await evaluation.save();
        return evaluation;
    } else {
        return null;
    }
}

export async function updateScout(scoutId: string, scoutJson: any): Promise<IScout | null> {
    const scout = await Scout.findById(scoutId).exec();
    if (scout) {
        scout.firstName = scoutJson.firstName ?? scout.firstName;
        scout.lastName = scoutJson.lastName ?? scout.lastName
        scout.queryName = createQueryName(scout.firstName, scout.lastName);
        scout.dateOfBirth = scoutJson.dateOfBirth ?? scout.dateOfBirth;
        scout.position = scoutJson.position ?? scout.position;
        scout.team = scoutJson.team ?? scout.team;
        scout.permissionLevel = scoutJson.permissionLevel ?? scout.permissionLevel;
        scout.imageUrl = scoutJson.imageUrl ?? scout.imageUrl;
        await scout.save();
        return scout;
    } else {
        return null;
    }
}

export async function updateCourse(courseId: string, courseJson: any): Promise<ICourse | null> {
    const course = await Course.findById(courseId).exec();
    if (course) {
        course.unitName = courseJson.unitName ?? course.unitName;
        course.startDate = courseJson.startDate ?? course.startDate;
        await course.save();
        return course;
    } else {
        return null;
    }
}