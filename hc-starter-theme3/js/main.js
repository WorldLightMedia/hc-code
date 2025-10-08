/**
 * Honest Cabinets Main JavaScript File
 * Handles all interactive functionality for the theme
 */

// Utility Functions
const HonestCabinets = {
  // Initialize all functionality when DOM is ready
  init: function() {
    this.mobileMenu();
    this.smoothScroll();
    this.formHandling();
    this.lazyLoading();
    this.animations();
    this.materialCarousel();
    this.instagramFeed();
    this.performanceOptimizations();
    this.accessibility();
  },

  // Mobile Menu Functionality
  mobileMenu: function() {
    const mobileToggle = document.querySelector('.header__mobile-toggle');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    const mobileClose = document.querySelector('.header__mobile-close');
    const body = document.body;
    
    if (mobileToggle && mobileMenu) {
      function toggleMobileMenu() {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;
        
        mobileToggle.setAttribute('aria-expanded', newState);
        mobileMenu.setAttribute('aria-hidden', !newState);
        body.style.overflow = newState ? 'hidden' : '';
        
        // Add/remove active class for styling
        mobileMenu.classList.toggle('mobile-menu--active', newState);
      }
      
      function closeMobileMenu() {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.classList.remove('mobile-menu--active');
        body.style.overflow = '';
      }
      
      // Event listeners
      mobileToggle.addEventListener('click', toggleMobileMenu);
      
      if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileMenu);
      }
      
      // Close menu when clicking overlay
      mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
          closeMobileMenu();
        }
      });
      
      // Close menu on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.getAttribute('aria-hidden') === 'false') {
          closeMobileMenu();
        }
      });
      
      // Close menu when clicking on menu links
      const mobileMenuLinks = mobileMenu.querySelectorAll('a');
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });
      
      // Close menu on window resize if open
      window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu.getAttribute('aria-hidden') === 'false') {
          closeMobileMenu();
        }
      });
    }
  },

  // Smooth Scrolling for Anchor Links
  smoothScroll: function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just a hash
        if (href === '#') return;
        
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.replaceState(null, null, href);
          
          // Focus the target element for accessibility
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
        }
      });
    });
  },

  // Form Handling and Validation
  formHandling: function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
          } else {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
          }
        });
        
        // Email validation
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (field.value && !emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
          }
        });
        
        if (isValid) {
          // Show loading state
          const submitButton = form.querySelector('button[type="submit"]');
          const originalText = submitButton.textContent;
          submitButton.textContent = 'Sending...';
          submitButton.disabled = true;
          
          // Here you would typically send the form data to HubSpot
          // For now, we'll simulate a successful submission
          setTimeout(() => {
            this.showSuccessMessage(form);
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            form.reset();
          }, 2000);
        } else {
          this.showErrorMessage(form);
        }
      });
      
      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', function() {
          this.validateField(input);
        }.bind(this));
        
        input.addEventListener('input', function() {
          if (input.classList.contains('error')) {
            this.validateField(input);
          }
        }.bind(this));
      });
    });
  },

  validateField: function(field) {
    let isValid = true;
    
    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
    }
    
    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
      }
    }
    
    if (isValid) {
      field.classList.remove('error');
      field.setAttribute('aria-invalid', 'false');
    } else {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
    }
    
    return isValid;
  },

  showSuccessMessage: function(form) {
    const message = document.createElement('div');
    message.className = 'form-message form-message--success';
    message.textContent = 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
    message.setAttribute('role', 'status');
    message.setAttribute('aria-live', 'polite');
    
    form.insertBefore(message, form.firstChild);
    
    setTimeout(() => {
      message.remove();
    }, 5000);
  },

  showErrorMessage: function(form) {
    const message = document.createElement('div');
    message.className = 'form-message form-message--error';
    message.textContent = 'Please correct the errors above and try again.';
    message.setAttribute('role', 'alert');
    message.setAttribute('aria-live', 'assertive');
    
    form.insertBefore(message, form.firstChild);
    
    setTimeout(() => {
      message.remove();
    }, 5000);
  },

  // Lazy Loading for Images
  lazyLoading: function() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  },

  // Scroll-based Animations
  animations: function() {
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      const animateElements = document.querySelectorAll('.services__content, .materials__content, .about__content');
      animateElements.forEach(el => {
        el.classList.add('animate-ready');
        animationObserver.observe(el);
      });
    }
  },

  // Material Library Carousel
  materialCarousel: function() {
    const prevBtn = document.querySelector('.materials__nav-btn--prev');
    const nextBtn = document.querySelector('.materials__nav-btn--next');
    const grid = document.querySelector('.materials__grid');
    
    if (prevBtn && nextBtn && grid) {
      let currentIndex = 0;
      const items = grid.querySelectorAll('.materials__category');
      const itemsPerView = window.innerWidth > 768 ? 3 : 1;
      const maxIndex = Math.max(0, items.length - itemsPerView);
      
      function updateCarousel() {
        const translateX = -(currentIndex * (100 / itemsPerView));
        grid.style.transform = `translateX(${translateX}%)`;
        
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
      }
      
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      });
      
      nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
          currentIndex++;
          updateCarousel();
        }
      });
      
      // Reset on window resize
      window.addEventListener('resize', () => {
        currentIndex = 0;
        updateCarousel();
      });
      
      updateCarousel();
    }
  },

  // Instagram Feed Placeholder
  instagramFeed: function() {
    const instagramPosts = document.querySelectorAll('.instagram__post');
    
    instagramPosts.forEach((post, index) => {
      // Add a background color based on index for visual variety
      const colors = ['#f0f0f0', '#e8e8e8', '#f5f5f5', '#eeeeee'];
      post.style.backgroundColor = colors[index % colors.length];
      
      // Add click handler (would integrate with Instagram API in production)
      post.addEventListener('click', () => {
        // Placeholder for Instagram integration
        console.log('Instagram post clicked:', index);
      });
    });
  },

  // Performance Optimizations
  performanceOptimizations: function() {
    // Debounce scroll events
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(() => {
        this.handleScroll();
      }, 10);
    });

    // Preload critical images
    const criticalImages = document.querySelectorAll('img[loading="eager"]');
    criticalImages.forEach(img => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src;
      document.head.appendChild(link);
    });
  },

  handleScroll: function() {
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;
    
    // Add shadow to header when scrolled
    if (scrollY > 10) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  },

  // Accessibility Enhancements
  accessibility: function() {
    // Keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.materials__category, .instagram__post');
    
    interactiveElements.forEach(element => {
      element.setAttribute('tabindex', '0');
      
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });

    // Announce page changes for screen readers
    const announcePageChange = (message) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    };

    // Skip links
    const skipLinks = document.querySelectorAll('.skip-link');
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView();
        }
      });
    });
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    HonestCabinets.init();
  });
} else {
  HonestCabinets.init();
}

// Add CSS for animations and form messages
const additionalStyles = `
<style>
/* Form Messages */
.form-message {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: 600;
}

.form-message--success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.form-message--error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Form Error States */
.contact__input.error {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

/* Animations */
.animate-ready {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Header scroll effect */
.header--scrolled {
  box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
}

/* Carousel styles */
.materials__grid {
  transition: transform 0.3s ease;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus improvements */
.materials__category:focus,
.instagram__post:focus {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .animate-ready,
  .materials__grid,
  .form-message {
    transition: none !important;
  }
}
</style>
`;

// Insert additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Export for use in other files
window.HonestCabinets = HonestCabinets;