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

  if (customAmountInput) {
    customAmountInput.addEventListener('focus', function() {
      const customRadio = document.querySelector('input[name="amount"][value="custom"]');
      if (customRadio) {
        customRadio.checked = true;
        customAmountDiv.style.display = 'block';
      }
    });
  }

  function redirectToCheckout(amount, mode) {
    return fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, mode })
    })
    .then(response => response.json())
    .then(data => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'No checkout URL returned');
      }
    });
  }

  // One-time donation form
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

      const submitBtn = donationForm.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Redirecting to checkout...';

      redirectToCheckout(amount, 'payment').catch(error => {
        console.error('Checkout error:', error);
        alert('There was an error processing your donation. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-lock" style="margin-right: 0.5rem;"></i>Proceed to Secure Checkout';
      });
    });
  }

  // Monthly donation form
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

      const submitBtn = monthlyForm.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Redirecting to checkout...';

      redirectToCheckout(amount, 'subscription').catch(error => {
        console.error('Checkout error:', error);
        alert('There was an error processing your donation. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-lock" style="margin-right: 0.5rem;"></i>Start Monthly Giving';
      });
    });
  }

  // Handle impact tier selection clicks
  const impactTiers = document.querySelectorAll('.impact-tier');
  impactTiers.forEach(tier => {
    tier.addEventListener('click', function() {
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        impactTiers.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
});
