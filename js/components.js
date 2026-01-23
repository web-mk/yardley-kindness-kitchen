// Component Loader for Our Kind Kitchen
// Loads navigation and footer components

document.addEventListener('DOMContentLoaded', function() {
  // Load Navigation
  const navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) {
    fetch('components/navigation.html')
      .then(response => response.text())
      .then(html => {
        navPlaceholder.innerHTML = html;

        // Re-initialize navigation after loading
        initializeNavigation();

        // Set active nav link
        setActiveNavLink();
      })
      .catch(error => console.error('Error loading navigation:', error));
  }

  // Load Footer
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('components/footer.html')
      .then(response => response.text())
      .then(html => {
        footerPlaceholder.innerHTML = html;
      })
      .catch(error => console.error('Error loading footer:', error));
  }
});

// Initialize navigation functionality
function initializeNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const body = document.body;

  if (menuToggle && mainNav && mobileOverlay) {
    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when overlay is clicked
    mobileOverlay.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      mainNav.classList.remove('active');
      mobileOverlay.classList.remove('active');
      body.style.overflow = '';
    });

    // Mobile dropdown toggle
    const dropdownLinks = document.querySelectorAll('.nav-item.has-dropdown > .nav-link');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const parentItem = this.closest('.nav-item');
          parentItem.classList.toggle('active');
        }
      });
    });

    // Close menu on window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        body.style.overflow = '';
      }
    });
  }

  // Header shadow on scroll
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 16px rgba(164, 30, 52, 0.15)';
      } else {
        header.style.boxShadow = '0 2px 8px rgba(164, 30, 52, 0.1)';
      }
    });
  }
}

// Set active navigation link based on current page
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPage = link.getAttribute('href').split('#')[0];
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}
