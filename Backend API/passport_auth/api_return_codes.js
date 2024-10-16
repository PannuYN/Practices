const RETURN_CODES = {
    //successful and unsuccessful completion
    UNSUCCESSFUL: 0,
    SUCCESSFUL: 1,

    //other types of error and returns
    SYSTEM_ERROR: 2,
    INVALID_INPUT: 3,
    RETURN_EMPTY_SET: 4,
    NO_AFFECTED_ROW: 5,
    INCORRECT_EMAIL: 6,
    INCORRECT_PASSWORD: 7
}

const SERVER_STATUS = {
    OK: 200, //The request was successful
    CREATED: 201, //A new data was successfully created
    BAD_REQUEST: 400, //The request was invalid (e.g., missing parameters)
    UNAUTHORIZED: 401, //Authentication is required and has failed or not been provided
    FORBIDDEN: 403, //The request is understood, but it has been refused
    NOT_FOUND: 404, //The requested resource could not be found
    INTERNAL_SERVER_ERROR: 500, //A generic error indicating that something went wrong on the server side
}

module.exports = {
    RETURN_CODES, SERVER_STATUS
};