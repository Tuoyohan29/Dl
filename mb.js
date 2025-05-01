

document.addEventListener('DOMContentLoaded', function() {
    // Détection des appareils mobiles
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    // Ajouter la classe pour les animations d'entrée
    const blogPosts = document.querySelectorAll('.blog-post');
    blogPosts.forEach((post, index) => {
        post.style.setProperty('--index', index);
    });
    
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach((card, index) => {
        card.style.setProperty('--index', index);
    });
    
    // Amélioration des interactions tactiles
    if (isMobile) {
        // Ajouter des états actifs pour le feedback tactile
        const touchElements = document.querySelectorAll('.action-btn, .share-btn, .contact-btn, .gallery-btn, .thumbnail, .pagination a, .categories-list a');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
        
        // Améliorer le défilement des galeries
        const galleries = document.querySelectorAll('.gallery-thumbnails');
        galleries.forEach(gallery => {
            let isScrolling = false;
            let startX;
            let scrollLeft;
            
            gallery.addEventListener('touchstart', (e) => {
                isScrolling = true;
                startX = e.touches[0].pageX - gallery.offsetLeft;
                scrollLeft = gallery.scrollLeft;
            }, { passive: true });
            
            gallery.addEventListener('touchmove', (e) => {
                if (!isScrolling) return;
                const x = e.touches[0].pageX - gallery.offsetLeft;
                const walk = (x - startX) * 2;
                gallery.scrollLeft = scrollLeft - walk;
            }, { passive: true });
            
            gallery.addEventListener('touchend', () => {
                isScrolling = false;
            }, { passive: true });
        });
        
        // Animation de défilement pour les éléments
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.blog-post, .post-card, .sidebar-widget');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementBottom = element.getBoundingClientRect().bottom;
                const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
                
                if (isVisible) {
                    element.classList.add('animate-in');
                }
            });
        };
        
        // Ajouter la classe pour l'animation
        document.querySelectorAll('.blog-post, .post-card, .sidebar-widget').forEach(element => {
            element.classList.add('scroll-animation');
        });
        
        // Exécuter l'animation au chargement et au défilement
        window.addEventListener('load', animateOnScroll);
        window.addEventListener('scroll', animateOnScroll, { passive: true });
        
        // Ajouter des effets de parallaxe légers
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            document.querySelectorAll('.gallery-featured-image').forEach(image => {
                const parent = image.closest('.blog-post');
                const speed = 0.05;
                const yPos = -(scrollY * speed);
                if (isElementInViewport(parent)) {
                    image.style.transform = `translateY(${yPos}px)`;
                }
            });
        }, { passive: true });
        
        // Ajouter un effet de double-tap pour aimer
        document.querySelectorAll('.blog-post-title').forEach(title => {
            let lastTap = 0;
            
            title.addEventListener('touchend', function() {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                
                if (tapLength < 300 && tapLength > 0) {
                    const post = this.closest('.blog-post');
                    const likeBtn = post.querySelector('.like-btn');
                    if (likeBtn) {
                        likeBtn.click();
                        
                        // Afficher un effet de cœur
                        const heart = document.createElement('div');
                        heart.className = 'floating-heart';
                        heart.innerHTML = '<i class="fas fa-heart"></i>';
                        post.appendChild(heart);
                        
                        setTimeout(() => {
                            post.removeChild(heart);
                        }, 1000);
                    }
                }
                
                lastTap = currentTime;
            });
        });
    }
    
    // Fonction utilitaire pour vérifier si un élément est visible
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0 &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
            rect.right >= 0
        );
    }
    
    // Ajouter des styles pour les animations
    const style = document.createElement('style');
    style.textContent = `
        .scroll-animation {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .floating-heart {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ef4444;
            font-size: 5rem;
            animation: float-heart 1s forwards;
            z-index: 100;
            pointer-events: none;
        }
        
        @keyframes float-heart {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0);
            }
            50% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.2);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -30%) scale(1);
            }
        }
        
        .touch-active {
            background-color: var(--primary-light) !important;
        }
    `;
    
    document.head.appendChild(style);
});