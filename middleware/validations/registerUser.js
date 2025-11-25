const joi= require('joi');
const registerUserSchema= (req,res,next)=>{
    const schema= joi.object({
    firstName: joi.string().alphanum().min(3).max(30).required(),
    lastName: joi.string().alphanum().min(3).max(30).required(),
    dateOfBirth: joi.date().less('now'),
    email: joi.string().email({minDomainSegments: 2,tlds: { allow: ['com', 'net'] }}).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
confirmPassword: joi.string().valid(joi.ref('password')).required()
    .messages({ "caution": "confirm pass" }),
    role: joi.string().valid('user','admin').default('user'),

}); 
const { error } = schema.validate(req.body, { abortEarly: false });
if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
}
next();
}
module.exports = registerUserSchema;