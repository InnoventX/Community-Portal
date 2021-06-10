const stripe = require('../stripe');

const payment = async(req, res) => {
    const { token, userId } = req.body;

    if (!token) {
        throw new Error('token not found');
    }

    // * search in DB (DIY)
    const user;

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
        description: 'making payment just for testing',
        shipping: {
            name: user.name,
            address: {
                line1: '510 Townsend St',
                postal_code: '98140',
                city: 'San Francisco',
                state: 'CA',
                country: 'IN',
            },
        }
    });

    res.send({ id: payment.id })
}