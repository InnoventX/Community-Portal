const Stripe = require('stripe');

export const stripe = new Stripe("sk_test_51J0lCCSF2Q3S2kAVxD1sdORr8ePo1HrxbVQ9VZU8q2mdY7EDCB7DAaLCQOi9tfiebJz1CyuVWrmvbzXSPgE9ySZr00728dB4m7", {
    apiVersion: '2020-08-27'
});