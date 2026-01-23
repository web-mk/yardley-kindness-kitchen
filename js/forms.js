// Form handling JavaScript for Our Kind Kitchen

document.addEventListener('DOMContentLoaded', function() {

  // Form toggle buttons (Request for Myself / Nominate a Neighbor)
  const toggleButtons = document.querySelectorAll('.form-toggle-btn');
  const requestTypeInput = document.getElementById('requestType');

  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      toggleButtons.forEach(btn => btn.classList.remove('active'));

      // Add active class to clicked button
      this.classList.add('active');

      // Update hidden input value
      const formType = this.getAttribute('data-form');
      if (requestTypeInput) {
        requestTypeInput.value = formType;
      }
    });
  });

  // Form submission handling
  const forms = document.querySelectorAll('form[netlify]');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Add loading state
      form.classList.add('loading');
      const submitButton = form.querySelector('.form-submit');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;

      // Get form data
      const formData = new FormData(form);

      // Submit to Netlify
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(() => {
        // Show success message
        form.classList.remove('loading');
        const successMessage = form.querySelector('.form-success');
        if (successMessage) {
          successMessage.classList.add('active');
        }

        // Reset form
        form.reset();

        // Scroll to success message
        if (successMessage) {
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Re-enable button after delay
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = originalText;

          // Hide success message after 10 seconds
          setTimeout(() => {
            if (successMessage) {
              successMessage.classList.remove('active');
            }
          }, 10000);
        }, 2000);
      })
      .catch((error) => {
        console.error('Error:', error);
        form.classList.remove('loading');
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        alert('There was an error submitting your form. Please try again or contact us directly.');
      });
    });
  });

  // Form validation
  const inputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');

  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });

    input.addEventListener('input', function() {
      // Remove error state on input
      if (this.classList.contains('error')) {
        this.classList.remove('error');
        const errorMsg = this.parentElement.querySelector('.form-error');
        if (errorMsg) {
          errorMsg.classList.remove('active');
        }
      }
    });
  });

  function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');

    if (isRequired && !value) {
      showError(field, 'This field is required');
      return false;
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(field, 'Please enter a valid email address');
        return false;
      }
    }

    // Phone validation (basic)
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\(\)\+]+$/;
      if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
        showError(field, 'Please enter a valid phone number');
        return false;
      }
    }

    clearError(field);
    return true;
  }

  function showError(field, message) {
    field.classList.add('error');

    let errorMsg = field.parentElement.querySelector('.form-error');
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'form-error';
      field.parentElement.appendChild(errorMsg);
    }

    errorMsg.textContent = message;
    errorMsg.classList.add('active');
  }

  function clearError(field) {
    field.classList.remove('error');
    const errorMsg = field.parentElement.querySelector('.form-error');
    if (errorMsg) {
      errorMsg.classList.remove('active');
    }
  }

  // Donation amount selection
  const donationAmounts = document.querySelectorAll('.donation-amount input[type="radio"]');
  const customAmountInput = document.getElementById('customAmount');

  donationAmounts.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'custom' && customAmountInput) {
        customAmountInput.focus();
      }
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener('focus', function() {
      const customRadio = document.querySelector('.donation-amount input[value="custom"]');
      if (customRadio) {
        customRadio.checked = true;
      }
    });
  }
});
