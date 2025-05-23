// Enhanced Blog Functionality with Mobile Optimizations
document.addEventListener('DOMContentLoaded', function() {
  // Detect if device is mobile
  const isMobile = window.innerWidth < 768;
  
  // Back to top button
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('active');
      } else {
        backToTopButton.classList.remove('active');
      }
    });
    
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // Gallery functionality with mobile optimizations
  const galleries = document.querySelectorAll('.blog-post-gallery');
  
  galleries.forEach(gallery => {
    const mainImg = gallery.querySelector('.gallery-featured-image');
    const thumbnails = gallery.querySelectorAll('.thumbnail');
    const prevBtn = gallery.querySelector('.prev-btn');
    const nextBtn = gallery.querySelector('.next-btn');
    
    let currentImgIndex = 0;
    const maxImgIndex = thumbnails.length - 1;
    
    function updateGallery() {
      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentImgIndex);
      });
      
      if (thumbnails[currentImgIndex]) {
        const imgSrc = thumbnails[currentImgIndex].querySelector('img').src;
        
        // Simpler transition for mobile
        if (isMobile) {
          mainImg.src = imgSrc;
        } else {
          // Fancier transition for desktop
          mainImg.style.opacity = '0';
          mainImg.style.transform = 'scale(0.95)';
          
          setTimeout(() => {
            mainImg.src = imgSrc;
            mainImg.style.opacity = '1';
            mainImg.style.transform = 'scale(1)';
          }, 300);
        }
      }
    }
    
    thumbnails.forEach((thumb, i) => {
      thumb.addEventListener('click', () => {
        currentImgIndex = i;
        updateGallery();
      });
    });
    
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentImgIndex = (currentImgIndex - 1 + thumbnails.length) % thumbnails.length;
        updateGallery();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentImgIndex = (currentImgIndex + 1) % thumbnails.length;
        updateGallery();
      });
    }
    
    // Add swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    gallery.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    gallery.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next image
        currentImgIndex = (currentImgIndex + 1) % thumbnails.length;
        updateGallery();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous image
        currentImgIndex = (currentImgIndex - 1 + thumbnails.length) % thumbnails.length;
        updateGallery();
      }
    }
    
    // Auto slide every 5 seconds (disable on mobile to save battery)
    if (!isMobile) {
      let galleryInterval = setInterval(() => {
        currentImgIndex = (currentImgIndex + 1) % thumbnails.length;
        updateGallery();
      }, 5000);
      
      gallery.addEventListener('mouseenter', () => {
        clearInterval(galleryInterval);
      });
      
      gallery.addEventListener('mouseleave', () => {
        galleryInterval = setInterval(() => {
          currentImgIndex = (currentImgIndex + 1) % thumbnails.length;
          updateGallery();
        }, 5000);
      });
    }
  });
  
  // Like button functionality with optimized heart animation
  const likeBtns = document.querySelectorAll('.like-btn');
  
  likeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const countEl = this.querySelector('.like-count');
      let count = parseInt(countEl.textContent);
      
      if (!this.classList.contains('liked')) {
        count++;
        this.classList.add('liked');
        this.querySelector('i').classList.remove('far');
        this.querySelector('i').classList.add('fas');
        
        // Add heart animation (simpler on mobile)
        const heartCount = isMobile ? 1 : 3;
        
        for (let i = 0; i < heartCount; i++) {
          const heart = document.createElement('span');
          heart.classList.add('heart-animation');
          heart.innerHTML = '❤️';
          heart.style.position = 'absolute';
          heart.style.top = '50%';
          heart.style.left = '50%';
          heart.style.pointerEvents = 'none';
          heart.style.fontSize = `${Math.random() * 5 + 15}px`;
          heart.style.transform = 'translate(-50%, -50%)';
          heart.style.opacity = '0';
          heart.style.animation = `floatHeart ${Math.random() * 0.3 + 0.7}s forwards`;
          heart.style.animationDelay = `${i * 0.1}s`;
          
          this.appendChild(heart);
          
          setTimeout(() => {
            heart.remove();
          }, 1500);
        }
      } else {
        count--;
        this.classList.remove('liked');
        this.querySelector('i').classList.remove('fas');
        this.querySelector('i').classList.add('far');
      }
      
      countEl.textContent = count;
    });
  });
  
  // Share button functionality with mobile-friendly dialog
  const shareBtns = document.querySelectorAll('.share-btn');
  
  shareBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Create a modern share dialog
      const shareDialog = document.createElement('div');
      shareDialog.classList.add('share-dialog');
      
      shareDialog.innerHTML = `
        <div class="share-dialog-content">
          <h3>Partager cet article</h3>
          <div class="share-options">
            <a href="#" class="share-option" data-platform="facebook">
              <i class="fab fa-facebook-f"></i>
              <span>Facebook</span>
            </a>
            <a href="#" class="share-option" data-platform="twitter">
              <i class="fab fa-twitter"></i>
              <span>Twitter</span>
            </a>
            <a href="#" class="share-option" data-platform="linkedin">
              <i class="fab fa-linkedin-in"></i>
              <span>LinkedIn</span>
            </a>
            <a href="#" class="share-option" data-platform="whatsapp">
              <i class="fab fa-whatsapp"></i>
              <span>WhatsApp</span>
            </a>
          </div>
          <button class="close-dialog">Fermer</button>
        </div>
      `;
      
      document.body.appendChild(shareDialog);
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .share-dialog {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }
        
        .share-dialog-content {
          background-color: white;
          border-radius: 16px;
          padding: ${isMobile ? '20px' : '30px'};
          width: 90%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 0 30px rgba(105, 199, 183, 0.3);
          transform: translateY(30px);
          animation: slideUp 0.5s forwards;
        }
        
        @keyframes slideUp {
          to {
            transform: translateY(0);
          }
        }
        
        .share-dialog h3 {
          margin-top: 0;
          margin-bottom: 25px;
          text-align: center;
          color: #0a2463;
          font-size: ${isMobile ? '1.3rem' : '1.5rem'};
          font-weight: 700;
          position: relative;
          padding-bottom: 15px;
        }
        
        .share-dialog h3::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(135deg, #0a2463, #69C7B7);
          border-radius: 3px;
        }
        
        .share-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: ${isMobile ? '15px' : '20px'};
          margin-bottom: ${isMobile ? '20px' : '30px'};
        }
        
        .share-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: ${isMobile ? '15px' : '20px'};
          border-radius: 12px;
          transition: all 0.3s ease;
          text-decoration: none;
          color: #333;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        
        .share-option::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(105, 199, 183, 0.1), rgba(10, 36, 99, 0.1));
          transition: all 0.3s ease;
          z-index: -1;
        }
        
        .share-option:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 0 10px rgba(105, 199, 183, 0.2);
        }
        
        .share-option:hover::before {
          left: 0;
        }
        
        .share-option i {
          font-size: ${isMobile ? '24px' : '28px'};
          margin-bottom: 10px;
          transition: all 0.3s ease;
        }
        
        .share-option:hover i {
          transform: scale(1.2);
        }
        
        .share-option[data-platform="facebook"] i {
          color: #3b5998;
        }
        
        .share-option[data-platform="twitter"] i {
          color: #1da1f2;
        }
        
        .share-option[data-platform="linkedin"] i {
          color: #0077b5;
        }
        
        .share-option[data-platform="whatsapp"] i {
          color: #25d366;
        }
        
        .close-dialog {
          display: block;
          width: 100%;
          padding: ${isMobile ? '12px' : '15px'};
          background: linear-gradient(135deg, #0a2463, #69C7B7);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: ${isMobile ? '15px' : '16px'};
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        
        .close-dialog::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #69C7B7, #0a2463);
          transition: all 0.3s ease;
          z-index: -1;
        }
        
        .close-dialog:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(105, 199, 183, 0.3);
        }
        
        .close-dialog:hover::before {
          left: 0;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes floatHeart {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -80px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -120px) scale(0.8);
          }
        }
      `;
      
      document.head.appendChild(style);
      
      // Close dialog
      const closeBtn = shareDialog.querySelector('.close-dialog');
      closeBtn.addEventListener('click', () => {
        shareDialog.style.animation = 'fadeOut 0.3s forwards';
        
        setTimeout(() => {
          shareDialog.remove();
          style.remove();
        }, 300);
      });
      
      // Handle share options
      const shareOptions = shareDialog.querySelectorAll('.share-option');
      shareOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          e.preventDefault();
          const platform = option.getAttribute('data-platform');
          const url = encodeURIComponent(window.location.href);
          const title = encodeURIComponent(document.title);
          
          let shareUrl = '';
          
          switch(platform) {
            case 'facebook':
              shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
              break;
            case 'twitter':
              shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
              break;
            case 'linkedin':
              shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
              break;
            case 'whatsapp':
              shareUrl = `https://wa.me/?text=${title}%20${url}`;
              break;
          }
          
          if (shareUrl) {
            window.open(shareUrl, '_blank');
          }
          
          shareDialog.style.animation = 'fadeOut 0.3s forwards';
          
          setTimeout(() => {
            shareDialog.remove();
            style.remove();
          }, 300);
        });
      });
    });
  });
  
  // Carousel functionality with mobile optimizations
  const track = document.getElementById('carouselTrack');
  if (track) {
    const cards = track.querySelectorAll('.carousel-card');
    const prevBtn = document.getElementById('prevButton');
    const nextBtn = document.getElementById('nextButton');
    const dotsContainer = document.getElementById('carouselDots');
    
    let currentIndex = 0;
    const cardWidth = isMobile ? 220 : 320; // card width + gap
    const visibleCards = Math.floor(track.clientWidth / cardWidth) || (isMobile ? 1 : 3);
    const maxIndex = Math.max(0, cards.length - visibleCards);
    
    // Create dots
    if (dotsContainer) {
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }
    
    function updateDots() {
      if (!dotsContainer) return;
      
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
    
    function goToSlide(index) {
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      
      // Add smooth transition
      track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      
      updateDots();
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
      });
    }
    
    // Add touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next slide
        goToSlide(currentIndex + 1);
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous slide
        goToSlide(currentIndex - 1);
      }
    }
    
    // Auto slide (disable on mobile to save battery)
    if (!isMobile) {
      let interval = setInterval(() => {
        goToSlide((currentIndex + 1) % (maxIndex + 1));
      }, 5000);
      
      track.addEventListener('mouseenter', () => {
        clearInterval(interval);
      });
      
      track.addEventListener('mouseleave', () => {
        interval = setInterval(() => {
          goToSlide((currentIndex + 1) % (maxIndex + 1));
        }, 5000);
      });
    }
    
    // Initialize first slide
    goToSlide(0);
  }
  
  // Add smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - (isMobile ? 70 : 100),
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add animation to elements when they come into view
  const animateOnScroll = function() {
    // Skip heavy animations on mobile
    if (isMobile) return;
    
    const elements = document.querySelectorAll('.blog-post, .sidebar-widget, .portfolio-warp, .section-header, .main-title');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 50) {
        element.classList.add('animated');
      }
    });
  };
  
  // Add the animated class
  const style = document.createElement('style');
  style.textContent = `
    .blog-post, .sidebar-widget, .portfolio-warp, .section-header, .main-title {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .blog-post.animated, .sidebar-widget.animated, .portfolio-warp.animated, .section-header.animated, .main-title.animated {
      opacity: 1;
      transform: translateY(0);
    }
    
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Run on load and scroll (if not mobile)
  if (!isMobile) {
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
  } else {
    // For mobile, just make everything visible without animations
    document.querySelectorAll('.blog-post, .sidebar-widget, .portfolio-warp, .section-header, .main-title').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
});