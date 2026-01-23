// Donation JavaScript for Our Kind Kitchen
// Handles Stripe checkout for one-time and recurring donations

document.addEventListener('DOMContentLoaded', function() {
  // Show/hide custom amount field
  const amountRadios = document.querySelectorAll('input[name="amount"]');
  const customAmountDiv = document.querySelector('.custom-amount');
  const customAmountInput = document.getElementById('customAmount');

  amountRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'custom') {
        customAmountDiv.style.display = 'block';
        customAmountInput.focus();
      } else {
        customAmountDiv.style.display = 'none';
      }
    });
  });

  // Auto-select custom radio when typing in custom amount
  if (customAmountInput) {
    customAmountInput.addEventListener('focus', function() {
      const customRadio = document.querySelector('input[name="amount"][value="custom"]');
      if (customRadio) {
        customRadio.checked = true;
        customAmountDiv.style.display = 'block';
      }
    });
  }

  // Handle donation form submission
  const donationForm = document.getElementById('donationForm');
  if (donationForm) {
    donationForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const selectedAmount = document.querySelector('input[name="amount"]:checked');
      let amount;

      if (selectedAmount.value === 'custom') {
        amount = parseFloat(customAmountInput.value);
        if (!amount || amount < 1) {
          alert('Please enter a valid donation amount.');
          customAmountInput.focus();
          return;
        }
      } else {
        amount = parseFloat(selectedAmount.value);
      }

      // For now, show alert that Stripe integration is needed
      // In production, this would call your Netlify Function to create a Stripe Checkout session
      alert(`Stripe integration needed!\n\nYou selected: $${amount}\n\nTo complete this integration:\n1. Set up Stripe account\n2. Add Stripe API keys to Netlify environment variables\n3. Create Netlify Function at functions/create-checkout-session.js\n4. Update this code to call the function\n\nSee README.md for details.`);

      // Production code would look like this:
      /*
      fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'usd',
          mode: 'payment'
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.sessionId) {
          const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
          return stripe.redirectToCheckout({ sessionId: data.sessionId });
        } else {
          throw new Error('Failed to create checkout session');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('There was an error processing your donation. Please try again.');
      });
      */
    });
  }

  // Handle impact tier selection clicks
  const impactTiers = document.querySelectorAll('.impact-tier');
  impactTiers.forEach(tier => {
    tier.addEventListener('click', function() {
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        // Remove active class from all tiers
        impactTiers.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tier
        this.classList.add('active');
      }
    });
  });

  // Handle monthly donation form (for monthly.html page)
  const monthlyForm = document.getElementById('monthlyDonationForm');
  if (monthlyForm) {
    monthlyForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const selectedTier = document.querySelector('input[name="tier"]:checked');
      let amount;

      if (selectedTier.value === 'custom') {
        amount = parseFloat(document.getElementById('customMonthlyAmount').value);
        if (!amount || amount < 1) {
          alert('Please enter a valid monthly donation amount.');
          return;
        }
      } else {
        amount = parseFloat(selectedTier.value);
      }

      // For now, show alert that Stripe integration is needed
      alert(`Stripe Subscription integration needed!\n\nYou selected: $${amount}/month\n\nTo complete this integration:\n1. Set up Stripe Subscription products\n2. Create price IDs for each tier\n3. Add Stripe API keys to Netlify\n4. Create Netlify Function for subscriptions\n5. Update this code\n\nSee README.md for details.`);

      // Production code would create a subscription session
    });
  }
});
