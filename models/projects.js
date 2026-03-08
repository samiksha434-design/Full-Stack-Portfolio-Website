const { types, required } = require("joi")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const projectsSchema = new Schema({
    title: {
        type: String,
        required : true
    },
    description :{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    github: String,
    live: String
});

module.exports = mongoose.model("Project", projectsSchema)