const mongoose = require('mongoose');

const paymentInfoSchema = mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, require: true },
    paid: { type: String, default: false }
});

module.exports = mongoose.model("Payment", paymentInfoSchema);