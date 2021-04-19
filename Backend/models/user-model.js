const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    
    name:{ type:String, required:true },
    
    email:{ type:String , required:true , unique:true },
    
    password:{ type:String , required:true , minlength:6 },

    image:{ type:String },
    
    questions:[
        { type:mongoose.Types.ObjectId , required:true , ref:'Question'}
    ],

    courses:[
        { type:mongoose.Types.ObjectId , required:true , ref:'Course'}
    ],
    
    answers:[
        { type:mongoose.Types.ObjectId , required:true , ref:'Answer' }
    ],

    savedAnswers:[
        { type:mongoose.Types.ObjectId , required:true , ref:'Answer' }
    ],

    resetToken: { type: String },
    
    resetExpire: { type: Date },

    schoolName:{ type:String, required:true },
    
    code: { type: String, required:true }
});

userSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User',userSchema);
