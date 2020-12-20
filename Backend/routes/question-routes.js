const express = require('express');

const router = express.Router();

router.get('/',(req,res,next) =>{
    res.send("question");
});

module.exports = router;