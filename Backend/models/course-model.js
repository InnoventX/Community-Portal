const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const courseSchema = mongoose.Schema({

    name: {type: String, required: true},

    topics: [
        {
            topicName: {type: String, required: true},
            subTopics: [
                {
                    sectionName: {type: String, required: true},
                    videoLink: {type: String, required: true},
                    time: {type: Number, required: true}
                },
            ],
            sectionTime: {type: Number, required: true},
        },
    ],

    rating: {type: Number, required: true},

    desc: [{
        para: {type: String, required: true},
    }],

    totalTime: {type: Number, required: true},

    price: {
        type: String
    },

    userWhoHasBought: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }],

});

courseSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Course', courseSchema);