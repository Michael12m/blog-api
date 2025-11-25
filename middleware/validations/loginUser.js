const joi = require('joi');

const loginUserSchema = (req,res,next) => {
    const schema = joi.object({
            email: joi.string().email({minDomainSegments: 2,tlds: { allow: ['com', 'net'] }}).required(),
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
    }); 
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map(detail => detail.message) });
    }
    next();
}
module.exports = loginUserSchema;