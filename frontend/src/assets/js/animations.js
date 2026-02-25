// Detect elements when they enter viewport and add animation classes
document.addEventListener('DOMContentLoaded', function() {
  // Add the fade-in-section class to all main sections
  const sections = [
    '.hero-slider',
    '.our-platforms',
    '.clientsAboutUs',
    '.our-customers',
    '.testimonial-section',
    '.contactUs-white-section',
    '.footer'
  ];
  
  sections.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.classList.add('fade-in-section');
    });
  });
  
  // Function to check if element is in viewport
  function checkIfInView() {
    const fadeElems = document.querySelectorAll('.fade-in-section');
    fadeElems.forEach(elem => {
      const rect = elem.getBoundingClientRect();
      const isInViewport = (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
      );
      
      if (isInViewport) {
        elem.classList.add('is-visible');
      }
    });
  }
  
  // Add hover effects to cards and buttons
  const cards = document.querySelectorAll('.our-platforms-card');
  cards.forEach(card => {
    card.addEventListener('mouseover', function() {
      this.style.transform = 'scale(1.02) translateY(-8px)';
    });
    
    card.addEventListener('mouseout', function() {
      this.style.transform = 'none';
    });
  });
  
  // Initial check on load
  checkIfInView();
  
  // Check on scroll
  window.addEventListener('scroll', checkIfInView);
});