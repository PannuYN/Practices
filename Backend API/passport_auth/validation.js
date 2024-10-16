const Joi = require('joi');
const { SERVER_STATUS, RETURN_CODES } = require('./api_return_codes');

//schemas (validity rules)
const idSchema = Joi.number().integer().required(); 
const userSchema = Joi.object({
    name: Joi.string().required().max(50), email: Joi.string().email().required().max(100),
    ph_no: Joi.string().pattern(/^[\d+@.]+$/).max(20), status: Joi.number().valid(1, 0, -1).required(),
    profile_picture: Joi.string().max(255), created_by: Joi.string().email().max(100), updated_by: Joi.string().email().max(100)
}).unknown();
const serviceSchema = Joi.object({
    service: Joi.string().required().max(100), description: Joi.string().max(1000), status: Joi.number().valid(1, 0, -1).required(),
    created_by: Joi.string().email().max(100), updated_by: Joi.string().email().max(100)
}).unknown();
const businessAndServiceSchema = Joi.object({
    business_id: Joi.number().integer().required(), service_id: Joi.number().integer().required(),
    created_by: Joi.string().email().max(100), updated_by: Joi.string().email().max(100)
}).unknown();
const maintenanceHistoryDetailSchema = Joi.object({
    service_id: Joi.number().integer().required(), history_id: Joi.number().integer().required(),
    next_service_due: Joi.date(), status: Joi.number().valid(1, 0, -1).required(),
    created_by: Joi.string().email().max(100), updated_by: Joi.string().email().max(100)
}).unknown();
const addressSchema = Joi.object({
    street: Joi.string().max(255).required(),
    city: Joi.string().max(100).required(),
    region: Joi.string().max(100).required(),
    postal_code: Joi.number().integer().required(),
    status: Joi.number().integer().valid(0, 1, -1).required(),
    address_detail: Joi.string(),
    business_id: Joi.number().integer(),
    created_by: Joi.string().email(),
    updated_by: Joi.string().email(),
    location: Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required(),
    }),
}).unknown();

const locationSchema = Joi.object().keys({
    x : Joi.number().required(),
    y : Joi.number().required(),
})

// phone number pattern is start with (+) and minimum 1 to maximun 10,
//password pattern is minimum 8 to maximum 128 and the password must contain atleast one lowercase, one uppercase, one specialcharacter and one number.
const businessDetailSchema = Joi.object()
    .keys({
        name: Joi.string().max(50).required(),
        primary_contact_person: Joi.string().max(50).required(),
        primary_contact_no: Joi.string()
            .pattern(/^\+[0-9]{1,20}$/)
            .required(),
        secondary_contact_person: Joi.string().max(50),
        secondary_contact_no: Joi.string().pattern(/^\+[0-9]{1,20}$/),
        status: Joi.number().integer().valid(0, 1, -1).required(),
        email: Joi.string().email().max(100).required(),
        password: Joi.string()
            .min(8)
            .max(50)
            .pattern(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
            .required(),
        business_type: Joi.string().max(100),
        profile_picture: Joi.string(),
        created_by: Joi.string().email(),
        updated_by: Joi.string().email(),
    })
    .unknown();

const businessPhotoSchema = Joi.object({
    path: Joi.string().required(),
    created_by: Joi.string().required(),
    updated_by: Joi.string().required(),
    status: Joi.number().integer().valid(0, 1, -1).required(),
    business_id: Joi.number().integer(),
}).unknown();

const maintenanceHistorySchema = Joi.object({
    vehicle_id: Joi.number().integer().required(),
    business_id: Joi.number().integer().required(),
    status: Joi.number().integer().valid(0, 1, -1).required(),
    mileage: Joi.number().integer(),
    remark: Joi.string(),
    created_by: Joi.string().email(),
    updated_by: Joi.string().email(),
    date: Joi.date(),
}).unknown();

function validateRequest(body, schema, response) {
    const validation = schema.validate(body);
    const { error } = validation;
    if(error){
        response.status(SERVER_STATUS.BAD_REQUEST)
        .json({code: RETURN_CODES.INVALID_INPUT, error: error}); //handle respons
        return false; //for checking in controller
    }
    return true; //for checking in controller
}

module.exports = {
    idSchema, userSchema, serviceSchema, businessAndServiceSchema,
    maintenanceHistoryDetailSchema, businessDetailSchema,
    businessPhotoSchema, maintenanceHistorySchema, addressSchema, locationSchema,
    validateRequest
  };