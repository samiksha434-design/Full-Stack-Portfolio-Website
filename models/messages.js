const { types } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema

const messagesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    message :{
        type: String,
    },
    createdAt :{
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Messages", messagesSchema);
