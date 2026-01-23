// Netlify Function for Stripe Checkout
// Creates a Stripe Checkout Session for one-time donations

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { amount, mode = 'payment' } = JSON.parse(event.body);

    // Validate amount
    if (!amount || amount < 1) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount' })
      };
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation to Our Kind Kitchen',
              description: 'Support our mission to provide gourmet home-cooked meals to neighbors in need',
              images: ['https://yourdomain.com/assets/images/logo/our-kind-kitchen-logo-color.png'],
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${event.headers.origin || 'https://yourdomain.com'}/donation-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${event.headers.origin || 'https://yourdomain.com'}/donate.html`,
      metadata: {
        type: 'one-time-donation'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url
      })
    };

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        message: error.message
      })
    };
  }
};
