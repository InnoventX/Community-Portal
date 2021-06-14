// const stripe = require('../stripe');
const Payment = require('../models/payment-model');
const HttpError = require('../util/http-error-message');
const nodemailer = require("nodemailer");
const Stripe = require('stripe');

const stripe = new Stripe("sk_test_51J0lCCSF2Q3S2kAVxD1sdORr8ePo1HrxbVQ9VZU8q2mdY7EDCB7DAaLCQOi9tfiebJz1CyuVWrmvbzXSPgE9ySZr00728dB4m7", {
    apiVersion: '2020-08-27'
});


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "jdbhavsar213@gmail.com",
        pass: 'jaydev@385'
    }
});

const payment = async(req, res, next) => {
    const { token, userId } = req.body;

    if (!token) {
        throw new Error('token not found');
    }

    // * search in DB (DIY)
    const user = await Payment.findById(userId);

    if (!user) {
        return next(new HttpError('User not found'));
    }

    const charge = await stripe.charges.create({
        currency: 'inr',
        amount: 400000,
        source: token,
        description: 'making payment just for testing',
        shipping: {
            name: user.name,
            address: {
                line1: 'Adani Shantigram',
                postal_code: '382421',
                city: 'Ahmedabad',
                state: 'GUJARAT',
                country: 'INR',
            },
        }
    });
    console.log(charge);

    if (charge) {
        user.paid = true;
        await user.save();
        res.send({ id: user.id })
    }

    res.send({ id: user.id })
}

const userPaymentInfo = async(req, res, next) => {
    const { name, surname, email } = req.body;

    const existUser = await Payment.findOne({ email: email, paid: true });

    if (existUser) {
        return next(new HttpError('User is already register', 404));
    }

    let newUser = new Payment({ name, surname, email });

    try {

        await newUser.save();


    } catch (error) {
        return next(new HttpError('Something went wrong', 500));
    }
    // * send link in the email 
    let mailOptions = {
        from: "jdbhavsar213@gmail.com",
        to: `${newUser.email}`,
        subject: "Payment Link",
        text: `Following is the link: https://localhost:5000/${newUser.id}`
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent:" + info.response);
        }
    });

    res.json({ success: "user added successfully", id: newUser.id });
}

exports.userPaymentInfo = userPaymentInfo;
exports.payment = payment;