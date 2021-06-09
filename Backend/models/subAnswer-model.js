const mongoose = require('mongoose');

const subAnswerSchema = mongoose.Schema({
    
    userId:{ type:mongoose.Types.ObjectId , require:true , ref:'User'},
    
    userName:{ type:String , require:true},

    userImage:{type:String , require:true},

    parentAnswerId:{type:mongoose.Types.ObjectId , require:true, ref:'Answer'},

    subAnswer:{type:String, require:true}

});

module.exports = mongoose.model("Subanswer",subAnswerSchema); 