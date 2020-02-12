//VALIDATION
const Joi = require('@hapi/joi');

//Register VALIDATION
const registerVALIDATION = (data) => {
    const Joi_schema = Joi.object({
        pseudo: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        mailing: Joi.boolean().required()
    });
    
    //LET'S VALIDATE DATA
    return Joi_schema.validate(data);
}

//Login VALIDATION
const loginVALIDATION = (data) => {
    const Joi_schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    
    //LET'S VALIDATE DATA
    return Joi_schema.validate(data);
}

module.exports.registerVALIDATION = registerVALIDATION;
module.exports.loginVALIDATION = loginVALIDATION;