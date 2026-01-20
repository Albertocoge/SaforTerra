const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res, next) => {
  try {
    const { cartProducts } = req.body; 
    
    const lineItems = cartProducts.map(product => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: product.name,
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/payment/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/payment/cancel`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    next(error);
  }
});

router.get('/success', (req, res) => {
  res.render('payment/success');
});

router.get('/cancel', (req, res) => {
  res.render('payment/cancel');
});

module.exports = router;
