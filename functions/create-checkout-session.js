const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { amount, mode = 'payment' } = JSON.parse(event.body);

    if (!amount || amount < 1) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid amount' }) };
    }

    const origin = event.headers.origin || 'https://kindness-kitchen-yardley.netlify.app';

    const priceData = {
      currency: 'usd',
      product_data: {
        name: mode === 'subscription'
          ? 'Monthly Donation to Our Kind Kitchen'
          : 'Donation to Our Kind Kitchen',
        description: 'Supporting gourmet home-cooked meals for neighbors in need',
      },
      unit_amount: Math.round(amount * 100),
    };

    if (mode === 'subscription') {
      priceData.recurring = { interval: 'month' };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price_data: priceData, quantity: 1 }],
      mode: mode,
      success_url: `${origin}/donation-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${mode === 'subscription' ? 'monthly' : 'donate'}.html`,
      metadata: { type: mode === 'subscription' ? 'monthly-donation' : 'one-time-donation' }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };

  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create checkout session', message: error.message })
    };
  }
};
