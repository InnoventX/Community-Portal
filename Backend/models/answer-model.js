const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    
    userId:{ type:mongoose.Types.ObjectId , required:true , ref:'User' },

    userName:{ type:String , require:true },

    answer:{ type:String , require:true },
    
    rating:{ type:Number , required:true },
    
    questionId:{ type:mongoose.Types.ObjectId , required:true , ref:'Question' }
});

module.exports = mongoose.model('Answer',answerSchema);