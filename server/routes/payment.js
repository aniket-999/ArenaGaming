const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const shortid = require('shortid')

const Razorpay = require("razorpay");
var razorpay = new Razorpay({
    key_id: 'rzp_test_OzIqGmavOiK6Tx',
    key_secret: 'JmUaRhcSu1RPCQnjd0gfmMYE'
})
router.post("/razorpay", async (req, res) => {
    const payment_capture = 1
    const amount = 50
    const currency = 'INR'
    const options = {
        amount: amount * 100, 
        currency, 
        receipt: shortid.generate(), 
        payment_capture
    }
    try {
        const response = await razorpay.orders.create(options)
        console.log(response)
        console.log("Teri maa ka bhosda")
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
        })
    } catch(error) {
        console.log(error);
    }
});

module.exports = router