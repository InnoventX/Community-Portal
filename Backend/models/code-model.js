const mongoose = require('mongoose');
const crypto = require('crypto');
const mongooseUniqueValidator = require('mongoose-unique-validator');


const codeSchema = mongoose.Schema({

    schoolName:{ type:String, required:true },

    code: { type: String }
});

codeSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Code',codeSchema);
