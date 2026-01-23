// Main JavaScript for Our Kind Kitchen

document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for anchor links
  document.addEventListener('click', function(e) {
    const target = e.target.closest('a[href^="#"]');
    if (target) {
      const href = target.getAttribute('href');
      if (href !== '#' && href !== '') {
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Close mobile menu if open
          const mainNav = document.getElementById('mainNav');
          const menuToggle = document.getElementById('menuToggle');
          const mobileOverlay = document.getElementById('mobileOverlay');
          if (mainNav && mainNav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
          }
        }
      }
    }
  });

  // Fade in animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe cards and sections
  setTimeout(() => {
    document.querySelectorAll('.card, section').forEach(el => {
      observer.observe(el);
    });
  }, 100);
});
