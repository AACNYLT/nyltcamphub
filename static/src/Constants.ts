export const LOG_IN_URL = `${process.env.REACT_APP_ENVIRONMENT === 'development' ? 'http://localhost' : ''}/api/login`;
export const COURSE_URL = `${process.env.REACT_APP_ENVIRONMENT === 'development' ? 'http://localhost' : ''}/api/course`;
export const DATA_UPLOAD_URL = `${process.env.REACT_APP_ENVIRONMENT === 'development' ? 'http://localhost' : ''}/api/data/course`;
export const ALL_COURSE_URL = `${process.env.REACT_APP_ENVIRONMENT === 'development' ? 'http://localhost' : ''}/api/course/all`;

export enum Screen {
    LOGIN,
    MAIN_LIST,
    ADMIN
}

export const MESSAGES = {
    LOGIN_NOT_FOUND: 'We don\'t recognize that first name + last name + date of birth combination. Please make sure you entered it correctly - if you did, you may not be in the system.',
    LOGIN_ERROR: 'We weren\'t able to log you in. Please check your internet connection.',
    LOAD_COURSE_ERROR: 'Error loading data. Please refresh the app and try again.',
    LOAD_ALL_COURSES_ERROR: 'Error communicating with the server. Please refresh the app and try again.',
    DELETE_COURSE_ERROR: 'We were unable to delete that course. Please try again.',
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