const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const sectionSchema = mongoose.Schema({

    sectionName: { type: String, required: true },

    videoLink: { type: String, required: true },

    time: { type: Number, required: true },

    coursesName: {type: String, required: true},
});

module.exports = mongoose.model('Section', sectionSchema);