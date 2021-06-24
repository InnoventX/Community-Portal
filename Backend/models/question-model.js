const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    userId:{ type:mongoose.Types.ObjectId , required:true , ref:'User'},

    userEmail:{ type:String , required:true },

    userName:{type:String , require:true },

    userImage:{type:String , require:true},
    
    title:{type:String , require:true },
    
    category:{type:String , require:true},
    
    wholeQuestion:{type:String , require:true},

    image:{ type:String },

    answers: [
        { type:mongoose.Types.ObjectId , required:true , ref:'Answer' }
    ]
});

module.exports = mongoose.model("Question",questionSchema);