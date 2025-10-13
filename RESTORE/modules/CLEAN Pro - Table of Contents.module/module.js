// // Get all the anchor links
const anchorLinks = document.querySelectorAll('.table-of-contents a[href^="#"]:not([href="#"])');
console.log('anchorLinks', anchorLinks);

// Get all the target elements
const targets = Array.from(anchorLinks).map((link) => {
  const id = link.getAttribute('href');
  console.log('id', id);
  const targetElement = document.querySelector(id);
  return targetElement ? { element: targetElement, id } : null;
}).filter(target => target !== null);
console.log('targets', targets);

// Create an IntersectionObserver instance
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const target = targets.find(target => target.element === entry.target);
    if (target) {
      const link = document.querySelector(`a[href="${target.id}"]`);
      if (entry.isIntersecting) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}, {
  rootMargin: '0px',
  threshold: 0.1 // Change this value to adjust when the "active" class is added or removed
});

// Observe the target elements
targets.forEach((target) => {
  observer.observe(target.element);
});

// Add active class on page load if a target is in the viewport
window.addEventListener('load', () => {
  targets.forEach((target) => {
    const rect = target.element.getBoundingClientRect();
    if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth)) {
      const link = document.querySelector(`a[href="${target.id}"]`);
      link.classList.add('active');
    }
  });
});
