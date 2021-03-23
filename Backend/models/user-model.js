const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    
    name:{ type:String, required:true },
    
    email:{ type:String , required:true , unique:true },
    
    password:{ type:String , required:true , minlength:6 },
    
    questions:[
        { type:mongoose.Types.ObjectId , required:true , ref:'Question'}
    ],
    
    answers:[
        { type:mongoose.Types.ObjectId , required:true , ref:'Answer' }
    ],

    savedAnswers:[
        { type:mongoose.Types.ObjectId , required:true , ref:'Answer' }
    ],

    resetToken: { type: String },
    
    resetExpire: { type: Date }
});

userSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User',userSchema);
