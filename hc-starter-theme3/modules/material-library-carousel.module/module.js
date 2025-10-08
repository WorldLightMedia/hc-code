/**
 * Enhanced Material Library Carousel Module
 * Supports configurable scroll amounts, door images, color swatches, and click URLs
 */

class MaterialLibraryCarousel {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.material-library__track');
    this.items = container.querySelectorAll('.material-library__item');
    this.prevBtn = container.querySelector('.carousel__nav--prev');
    this.nextBtn = container.querySelector('.carousel__nav--next');
    this.indicators = container.querySelectorAll('.carousel__indicator');
    
    // Configuration from data attributes
    this.itemsDesktop = parseInt(container.dataset.itemsDesktop) || 6;
    this.itemsTablet = parseInt(container.dataset.itemsTablet) || 4;
    this.itemsMobile = parseInt(container.dataset.itemsMobile) || 2;
    this.autoScroll = container.dataset.autoScroll === 'true';
    this.scrollDelay = parseInt(container.dataset.scrollDelay) || 3000;
    this.scrollAmount = parseInt(container.dataset.scrollAmount) || 1;
    
    // State management
    this.currentIndex = 0;
    this.totalItems = this.items.length;
    this.itemsPerView = this.getItemsPerView();
    this.maxIndex = Math.max(0, this.totalItems - this.itemsPerView);
    this.autoScrollTimer = null;
    this.isTransitioning = false;
    
    // Touch/swipe support
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isDragging = false;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateItemWidths();
    this.updateNavigation();
    this.updateIndicators();
    this.setupImageModal();
    
    if (this.autoScroll) {
      this.startAutoScroll();
    }
  }
  
  setupEventListeners() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.goToPrevious());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.goToNext());
    }
    
    // Indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index * this.scrollAmount));
    });
    
    // Touch/swipe events
    this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    
    // Mouse drag events
    this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.track.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.track.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
    
    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Window resize
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));
    
    // Auto-scroll pause on hover
    if (this.autoScroll) {
      this.container.addEventListener('mouseenter', () => this.pauseAutoScroll());
      this.container.addEventListener('mouseleave', () => this.resumeAutoScroll());
    }
  }
  
  setupImageModal() {
    // Add click listeners to door images for modal display
    this.items.forEach(item => {
      const image = item.querySelector('.material-sample__image[data-full-image]');
      const materialSample = item.querySelector('.material-sample');
      
      if (image && materialSample && !item.querySelector('.material-sample__link')) {
        materialSample.addEventListener('click', (e) => {
          e.preventDefault();
          this.showImageModal(image.dataset.fullImage, image.alt);
        });
        materialSample.style.cursor = 'pointer';
      }
    });
  }
  
  showImageModal(imageSrc, imageAlt) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'material-modal-overlay';
    modal.innerHTML = `
      <div class="material-modal">
        <button class="material-modal__close" aria-label="Close">&times;</button>
        <img src="${imageSrc}" alt="${imageAlt}" class="material-modal__image">
      </div>
    `;
    
    // Add modal styles if not already present
    if (!document.getElementById('material-modal-styles')) {
      const styles = document.createElement('style');
      styles.id = 'material-modal-styles';
      styles.textContent = `
        .material-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          animation: modalFadeIn 300ms ease-out forwards;
        }
        .material-modal {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .material-modal__close {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          border: none;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          z-index: 1;
          transition: background 200ms ease;
        }
        .material-modal__close:hover {
          background: rgba(0, 0, 0, 0.7);
        }
        .material-modal__image {
          display: block;
          width: 100%;
          height: auto;
          max-height: 90vh;
          object-fit: contain;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `;
      document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal handlers
    const closeModal = () => {
      modal.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
      }, 200);
    };
    
    modal.querySelector('.material-modal__close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    // ESC key to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }
  
  getItemsPerView() {
    const width = window.innerWidth;
    if (width >= 1024) return this.itemsDesktop;
    if (width >= 768) return this.itemsTablet;
    return this.itemsMobile;
  }
  
  updateItemWidths() {
    const itemsPerView = this.getItemsPerView();
    const gapSize = window.innerWidth >= 768 ? 24 : 20;
    const totalGaps = (itemsPerView - 1) * gapSize;
    const itemWidth = `calc((100% - ${totalGaps}px) / ${itemsPerView})`;
    
    this.items.forEach(item => {
      item.style.width = itemWidth;
    });
  }
  
  goToNext() {
    if (this.isTransitioning) return;
    
    const newIndex = Math.min(this.currentIndex + this.scrollAmount, this.maxIndex);
    if (newIndex !== this.currentIndex) {
      this.currentIndex = newIndex;
    } else if (this.autoScroll) {
      // Loop back to beginning in auto-scroll mode
      this.currentIndex = 0;
    }
    
    this.updateCarousel();
  }
  
  goToPrevious() {
    if (this.isTransitioning) return;
    
    const newIndex = Math.max(this.currentIndex - this.scrollAmount, 0);
    if (newIndex !== this.currentIndex) {
      this.currentIndex = newIndex;
    } else if (this.autoScroll) {
      // Loop to end in auto-scroll mode
      this.currentIndex = this.maxIndex;
    }
    
    this.updateCarousel();
  }
  
  goToSlide(index) {
    if (this.isTransitioning || index === this.currentIndex) return;
    
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
    this.updateCarousel();
  }
  
  updateCarousel() {
    if (!this.track || !this.items.length) return;
    
    this.isTransitioning = true;
    
    const itemWidth = this.items[0].getBoundingClientRect().width;
    const gap = window.innerWidth >= 768 ? 24 : 20;
    const translateX = -(this.currentIndex * (itemWidth + gap));
    
    this.track.style.transform = `translateX(${translateX}px)`;
    
    this.updateNavigation();
    this.updateIndicators();
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, 350);
  }
  
  updateNavigation() {
    if (this.prevBtn) {
      this.prevBtn.disabled = !this.autoScroll && this.currentIndex === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = !this.autoScroll && this.currentIndex >= this.maxIndex;
    }
  }
  
  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      const slideIndex = index * this.scrollAmount;
      indicator.classList.toggle('active', 
        slideIndex >= this.currentIndex && 
        slideIndex < this.currentIndex + this.itemsPerView
      );
    });
  }
  
  handleResize() {
    const newItemsPerView = this.getItemsPerView();
    if (newItemsPerView !== this.itemsPerView) {
      this.itemsPerView = newItemsPerView;
      this.maxIndex = Math.max(0, this.totalItems - this.itemsPerView);
      this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
      
      this.updateItemWidths();
      this.updateCarousel();
    }
  }
  
  // Touch/Swipe handlers (same as before)
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.isDragging = true;
    this.pauseAutoScroll();
  }
  
  handleTouchMove(e) {
    if (!this.isDragging) return;
    
    const touchMoveX = e.touches[0].clientX;
    const diff = Math.abs(touchMoveX - this.touchStartX);
    if (diff > 10) {
      e.preventDefault();
    }
  }
  
  handleTouchEnd(e) {
    if (!this.isDragging) return;
    
    this.touchEndX = e.changedTouches[0].clientX;
    this.handleSwipe();
    this.isDragging = false;
    this.resumeAutoScroll();
  }
  
  handleMouseDown(e) {
    e.preventDefault();
    this.touchStartX = e.clientX;
    this.isDragging = true;
    this.pauseAutoScroll();
    this.track.style.cursor = 'grabbing';
  }
  
  handleMouseMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
  }
  
  handleMouseUp(e) {
    if (!this.isDragging) return;
    
    this.touchEndX = e.clientX;
    this.handleSwipe();
    this.isDragging = false;
    this.resumeAutoScroll();
    this.track.style.cursor = '';
  }
  
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.goToNext();
      } else {
        this.goToPrevious();
      }
    }
  }
  
  handleKeydown(e) {
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.goToNext();
        break;
      case 'Home':
        e.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        this.goToSlide(this.maxIndex);
        break;
    }
  }
  
  startAutoScroll() {
    if (this.autoScrollTimer) return;
    
    this.autoScrollTimer = setInterval(() => {
      this.goToNext();
    }, this.scrollDelay);
  }
  
  pauseAutoScroll() {
    if (this.autoScrollTimer) {
      clearInterval(this.autoScrollTimer);
      this.autoScrollTimer = null;
    }
  }
  
  resumeAutoScroll() {
    if (this.autoScroll && !this.autoScrollTimer) {
      setTimeout(() => {
        this.startAutoScroll();
      }, 1000);
    }
  }
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  destroy() {
    this.pauseAutoScroll();
    window.removeEventListener('resize', this.handleResize);
  }
}

// Initialize all material library carousels
document.addEventListener('DOMContentLoaded', () => {
  const carouselContainers = document.querySelectorAll('.material-library__carousel-container');
  
  carouselContainers.forEach(container => {
    new MaterialLibraryCarousel(container);
  });
});

// Handle HubSpot editor preview mode
if (window.location.href.indexOf('hs_preview=true') !== -1) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const newCarousels = document.querySelectorAll('.material-library__carousel-container:not([data-initialized])');
        newCarousels.forEach(container => {
          container.setAttribute('data-initialized', 'true');
          new MaterialLibraryCarousel(container);
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
