export const LOG_IN_URL = `${process.env.REACT_APP_ENVIRONMENT === 'development' ? 'http://localhost' : ''}/api/login`


export const ERROR_MESSAGES = {
    LOGIN_NOT_FOUND: 'We don\'t recognize that first name + last name + date of birth combination. Please make sure you entered it correctly - if you did, you may not be in the system.',
    LOGIN_ERROR: 'We weren\'t able to log you in. Please check your internet connection.'
}