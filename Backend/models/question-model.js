const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    userId:{ type:mongoose.Types.ObjectId , required:true , ref:'User'},
    
    title:{type:String , require:true },
    
    category:{type:String , require:true},
    
    wholeQuestion:{type:String , require:true},

    answers: [
        { type:mongoose.Types.ObjectId , required:true , ref:'Answer' }
    ]
});

module.exports = mongoose.model("Question",questionSchema);