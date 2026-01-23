// Gallery JavaScript for Our Kind Kitchen

document.addEventListener('DOMContentLoaded', function() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const closeLightbox = document.getElementById('closeLightbox');
  const prevButton = document.getElementById('prevImage');
  const nextButton = document.getElementById('nextImage');

  let currentIndex = 0;
  const images = [];

  // Collect all images
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    images.push({
      src: img.src,
      alt: img.alt
    });

    // Open lightbox on click
    item.addEventListener('click', function() {
      openLightbox(index);
    });

    // Keyboard navigation for gallery items
    item.setAttribute('tabindex', '0');
    item.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightboxFn() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    lightboxImage.src = images[currentIndex].src;
    lightboxImage.alt = images[currentIndex].alt;
  }

  function showPreviousImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
  }

  // Close lightbox
  closeLightbox.addEventListener('click', closeLightboxFn);

  // Close on background click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightboxFn();
    }
  });

  // Navigation buttons
  prevButton.addEventListener('click', function(e) {
    e.stopPropagation();
    showPreviousImage();
  });

  nextButton.addEventListener('click', function(e) {
    e.stopPropagation();
    showNextImage();
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        closeLightboxFn();
        break;
      case 'ArrowLeft':
        showPreviousImage();
        break;
      case 'ArrowRight':
        showNextImage();
        break;
    }
  });
});
