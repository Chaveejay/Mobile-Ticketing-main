const Joi = require('joi');

const registerValidation = (data) => {
    // Define the base schema with conditional requirements based on the role
    const schema = Joi.object({
        first_name: Joi.when('role', {
            is: Joi.valid('User', 'Organizer'),
            then: Joi.string().alphanum().min(3).max(30).required(),
            otherwise: Joi.forbidden()
        }),
        last_name: Joi.when('role', {
            is: Joi.valid('User', 'Organizer'),
            then: Joi.string().alphanum().min(3).max(30).required(),
            otherwise: Joi.forbidden()
        }),
        org_name: Joi.when('role', {
            is: 'Organizer',
            then: Joi.string().alphanum().min(2).max(30).required(),
            otherwise: Joi.forbidden()
        }),
        nic: Joi.when('role', {
            is: 'Organizer',
            then: Joi.string().alphanum().min(12).max(13).required(),
            otherwise: Joi.forbidden()
        }),
        phone: Joi.string().pattern(/^\d{10}$/).required(),
        password: Joi.string().min(8).required(),
        role: Joi.string().valid('Admin', 'Organizer', 'User').required()
    });

    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        phone: Joi.string().pattern(/^\d{10}$/).required(),
        password: Joi.string().min(8).required(),
    });

    return schema.validate(data);
}

const forgotPasswordValidation = (data) => {
    const schema = Joi.object({
        phone: Joi.string().pattern(/^\d{10}$/).required(),
    });
    return schema.validate(data);
}

const resetPasswordValidation = (data) => {
    const schema = Joi.object({
        phone: Joi.string().pattern(/^\d{10}$/).required(),
        otp: Joi.string().length(6).required(),
        newPassword: Joi.string().min(8).required(),
        confirmPassword: Joi.string().min(8).required(),
    });
    return schema.validate(data);
}

const updateProfileValidation = (data) => {
    const schema = Joi.object({
        first_name: Joi.string().alphanum().min(3).max(30).required(),
        last_name: Joi.string().alphanum().min(3).max(30).required(),
        phone: Joi.forbidden(), // Prevent updating
        role: Joi.forbidden() 
    });

    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.forgotPasswordValidation = forgotPasswordValidation;
module.exports.resetPasswordValidation = resetPasswordValidation;
module.exports.updateProfileValidation = updateProfileValidation;
