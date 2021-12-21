const Joi = require("joi");
const mongoose = require("mongoose");

let toySchema = new mongoose.Schema({
    name: String,
    category: String,
    info: String,
    price: Number,
    img_url: {
        type: String, default: "https://images.pexels.com/photos/168866/pexels-photo-168866.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
    },
    date_created: {
        type: Date, default: Date.now()
    },
    user_id: String
})
exports.ToyModel = mongoose.model("toys", toySchema);

exports.validateToy = (_reqBody) => {
    let joiSchema = Joi.object({
        name:Joi.string().min(2).max(99).required(),
        category:Joi.string().min(2).max(99).required(),
        info:Joi.string().min(3).max(300).required(),
        price:Joi.number().min(1).max(9999).required(),
        img_url:Joi.string().min(1).max(999).allow(null,'')
    })
    return joiSchema.validate(_reqBody)
}