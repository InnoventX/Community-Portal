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
    user.paid = true;
    await user.save();

    res.send({ id: user.id })
}

const userPaymentInfo = async(req, res, next) => {
    const { name, surname, email } = req.body;

    const existUser = await Payment.findOne({ email: email, paid: true });
    let exist = false;
    if (existUser) {
        exist = true;
        res.send({ message: "User is already registered" });
    }

    let newUser = new Payment({ name, surname, email });

    try {

        await newUser.save();


    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
    // * send link in the email
    try {
        let mailOptions = {
            from: "jdbhavsar213@gmail.com",
            to: `${newUser.email}`,
            subject: "Payment Link",
            text: `Following is the link: http://localhost:3000/form/${newUser.id}`
        };
        if (!exist) {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Email sent:" + info.response);
                }
            });
        }
    } catch (error) {
        console.log(error);
        return next(new HttpError(error.message, 500));
    }

    res.json({ success: "user added successfully", id: newUser.id });
}

exports.userPaymentInfo = userPaymentInfo;
exports.payment = payment;