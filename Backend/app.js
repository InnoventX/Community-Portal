const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const questionRoutes = require('./routes/question-routes');
const answerRoutes = require("./routes/answer-routes");
const userRoutes = require("./routes/user-routes");
const { TheatersRounded } = require('@material-ui/icons');

app.use(bodyParser.json());

app.use('/api/user',userRoutes);

app.use('/api/question',questionRoutes);

app.use('/api/answer',answerRoutes);


mongoose
    .connect("mongodb+srv://innoventx:innoventx123@cluster0.humw3.mongodb.net/portal?retryWrites=true&w=majority",)
    .then(() => {
        app.listen(5000,function(){
            console.log("Server listening on Port 5000");
        });        
    })
    .catch((err) => {
        console.log(err);
    })
