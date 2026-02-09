// Component Loader for Our Kind Kitchen
// Loads navigation and footer components

document.addEventListener('DOMContentLoaded', function() {
  // Load Navigation
  var navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) {
    fetch('components/navigation.html')
      .then(function(response) { return response.text(); })
      .then(function(html) {
        navPlaceholder.innerHTML = html;

        // Re-initialize navigation after loading
        initializeNavigation();

        // Set active nav link
        setActiveNavLink();
      })
      .catch(function(error) { console.error('Error loading navigation:', error); });
  }

  // Load Footer
  var footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('components/footer.html')
      .then(function(response) { return response.text(); })
      .then(function(html) {
        footerPlaceholder.innerHTML = html;
        populateOrgInfo(footerPlaceholder);
      })
      .catch(function(error) { console.error('Error loading footer:', error); });
  }

  // Populate any org info placeholders already in the page
  populateOrgInfo(document);
});

// Populate elements with data-org attributes from SiteConfig
function populateOrgInfo(root) {
  if (typeof SiteConfig === 'undefined') return;

  var org = SiteConfig.org;
  var elements = root.querySelectorAll('[data-org]');

  elements.forEach(function(el) {
    var key = el.getAttribute('data-org');

    switch (key) {
      case 'tagline':
        el.textContent = org.tagline;
        break;
      case 'address':
        el.innerHTML = org.street + '<br>' + org.city + ', ' + org.state + ' ' + org.zip;
        break;
      case 'fullAddress':
        el.textContent = SiteConfig.fullAddress;
        break;
      case 'serviceArea':
        el.textContent = org.serviceArea;
        break;
      case 'orgDetails':
        el.innerHTML = '<strong>' + org.name + '</strong><br>' + org.type + '<br>EIN: ' + org.ein;
        break;
      case 'name':
        el.textContent = org.name;
        break;
      case 'ein':
        el.textContent = org.ein;
        break;
      case 'type':
        el.textContent = org.type;
        break;
      case 'location':
        el.textContent = SiteConfig.fullAddress;
        break;
      case 'purpose':
        el.textContent = org.purpose;
        break;
    }
  });
}

// Initialize navigation functionality
function initializeNavigation() {
  var menuToggle = document.getElementById('menuToggle');
  var mainNav = document.getElementById('mainNav');
  var mobileOverlay = document.getElementById('mobileOverlay');
  var body = document.body;

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
    var dropdownLinks = document.querySelectorAll('.nav-item.has-dropdown > .nav-link');
    dropdownLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          var parentItem = this.closest('.nav-item');
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
  var header = document.querySelector('.header');
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
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function(link) {
    var linkPage = link.getAttribute('href').split('#')[0];
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}
