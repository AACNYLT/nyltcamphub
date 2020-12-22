export const LOG_IN_URL = `${process.env.REACT_APP_ENVIRONMENT === 'development' ? 'http://localhost' : ''}/api/login`;
export const COURSE_URL = `${process.env.REACT_APP_ENVIRONMENT === 'development' ? 'http://localhost' : ''}/api/course`;
export const SCOUT_URL = `${process.env.REACT_APP_ENVIRONMENT === 'development' ? 'http://localhost' : ''}/api/scout`;
export const DATA_UPLOAD_URL = `${process.env.REACT_APP_ENVIRONMENT === 'development' ? 'http://localhost' : ''}/api/data/course`;
export const ALL_COURSE_URL = `${process.env.REACT_APP_ENVIRONMENT === 'development' ? 'http://localhost' : ''}/api/course/all`;
export const DATA_URL = `${process.env.REACT_APP_ENVIRONMENT === 'development' ? 'http://localhost' : ''}/api/data`;
export const TEMPLATE_URL = `${process.env.REACT_APP_ENVIRONMENT === 'development' ? 'http://localhost' : ''}/api/template`;

export enum Screen {
    LOGIN,
    MAIN_LIST,
    ADMIN,
    SCOUT,
    PROFILE
}

export const MESSAGES = {
    LOGIN_NOT_FOUND: 'We don\'t recognize that first name + last name + date of birth combination. Please make sure you entered it correctly - if you did, you may not be in the system.',
    LOGIN_ERROR: 'We weren\'t able to log you in. Please check your internet connection.',
    LOAD_COURSE_ERROR: 'Error loading data. Please refresh the app and try again.',
    LOAD_ALL_COURSES_ERROR: 'Error communicating with the server. Please refresh the app and try again.',
    LOAD_SCOUT_ERROR: 'We were unable to load that scout. Please try again.',
    SAVE_EVALUATION_ERROR: 'We had trouble saving that evaluation. Please try again',
    SAVE_EVALUATION_SUCCESS: 'Evaluation saved!',
    SCOUT_NOT_FOUND: 'We couldn\'t find that scout. They may not exist in the system.',
    DELETE_COURSE_ERROR: 'We were unable to delete that course. Please try again.',
    CREATE_COURSE_ERROR: 'We were unable to create that course. Please try again.',
    UPLOAD_CSV_SUCCESS: 'Successfully uploaded CSV!',
    UPLOAD_CSV_ERROR: 'Error uploading CSV. Please check the format.'
}

export const FORM_LAYOUT = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};
export const FORM_BUTTON_LAYOUT = {
    wrapperCol: {offset: 8, span: 16},
};