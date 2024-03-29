const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    
    userId:{ type:mongoose.Types.ObjectId , require:true , ref:'User' },

    userName:{ type:String , require:true },

    userImage:{type:String , require:true},

    answer:{ type:String , require:true },
    
    image:{ type:String },

    rating:{ type:Number , require:true },
    
    questionId:{ type:mongoose.Types.ObjectId , require:true , ref:'Question' },

    subAnswers:[
        {type:mongoose.Types.ObjectId , require:true , ref:'Subanswer'}
    ]

});

module.exports = mongoose.model('Answer',answerSchema);