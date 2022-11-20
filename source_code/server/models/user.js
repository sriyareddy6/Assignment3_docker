const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    user_name: {type:String, required:true},
    email: {type:String, required:true},
    bio: {type:String, required:false},
    image: {type:String, required:false},
    password: { type:String, required:true}

});
userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.PRIVATE_KEY, {
		expiresIn: "1h",
	});
	return token;
};

// const token = User.generateAuthToken();

const User = mongoose.model("user", userSchema);

const validate = (data) => {
    const schema = Joi.object({
        user_name: Joi.string().required().label("User Name"),
        email:Joi.string().required().label("Email required"),
        password:passwordComplexity().required().label("Password"),
        bio:Joi.string().allow(''),
        image:Joi.string().allow('')
    });

    return schema.validate(data)
}

module.exports = {User, validate};