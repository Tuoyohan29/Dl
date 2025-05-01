document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour initialiser une galerie d'images
    function initializeGallery(galleryContainer) {
        // Récupérer les éléments de cette galerie spécifique
        const mainImage = galleryContainer.querySelector('.gallery-main img');
        const thumbnails = galleryContainer.querySelectorAll('.thumbnail');
        const prevBtn = galleryContainer.querySelector('.prev-btn');
        const nextBtn = galleryContainer.querySelector('.next-btn');
        const likeBtn = galleryContainer.querySelector('.like-btn');
        const likeCount = galleryContainer.querySelector('.like-count');
        
        // Créer un tableau d'images pour cette galerie
        const galleryImages = [];
        thumbnails.forEach(thumb => {
            galleryImages.push(thumb.querySelector('img').src);
        });
        
        let currentImageIndex = 0;
        let isLiked = false;
        
        // Fonction pour changer l'image principale
        function changeImage(index) {
            if (index < 0) {
                index = galleryImages.length - 1;
            } else if (index >= galleryImages.length) {
                index = 0;
            }
            
            // Animation de transition
            mainImage.style.opacity = '0';
            
            setTimeout(() => {
                currentImageIndex = index;
                mainImage.src = galleryImages[currentImageIndex];
                mainImage.style.opacity = '1';
                
                // Mettre à jour la classe active sur les miniatures
                thumbnails.forEach(thumb => {
                    thumb.classList.remove('active');
                });
                
                thumbnails[currentImageIndex].classList.add('active');
            }, 300);
        }
        
        // Événements pour les boutons précédent/suivant
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                changeImage(currentImageIndex - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                changeImage(currentImageIndex + 1);
            });
        }
        
        // Événements pour les miniatures
        thumbnails.forEach((thumb, index) => {
            thumb.setAttribute('data-index', index);
            thumb.addEventListener('click', function() {
                const thumbIndex = parseInt(this.getAttribute('data-index'));
                changeImage(thumbIndex);
            });
        });
        
        // Événement pour le bouton "J'aime"
        if (likeBtn && likeCount) {
            likeBtn.addEventListener('click', function() {
                isLiked = !isLiked;
                
                if (isLiked) {
                    likeBtn.classList.add('liked');
                    const currentLikes = parseInt(likeCount.textContent);
                    likeCount.textContent = currentLikes + 1;
                } else {
                    likeBtn.classList.remove('liked');
                    const currentLikes = parseInt(likeCount.textContent);
                    likeCount.textContent = currentLikes - 1;
                }
                
                // Animation de pulsation
                likeBtn.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    likeBtn.style.transform = 'scale(1)';
                }, 200);
            });
        }
        
        // Diaporama automatique pour la galerie
        let slideInterval = setInterval(() => {
            changeImage(currentImageIndex + 1);
        }, 5000);
        
        // Arrêter le diaporama lorsque l'utilisateur interagit avec la galerie
        galleryContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        galleryContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                changeImage(currentImageIndex + 1);
            }, 5000);
        });
    }
    
    // Initialiser toutes les galeries sur la page
    const galleries = document.querySelectorAll('.blog-post-gallery');
    galleries.forEach(gallery => {
        initializeGallery(gallery);
    });
    
    // Animation au survol des cartes d'articles
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            if (img) img.style.transform = 'scale(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) img.style.transform = 'scale(1)';
        });
    });
    
    // Effet de défilement fluide pour les liens
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Initialiser tous les boutons de partage
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(shareBtn => {
        shareBtn.addEventListener('click', function() {
            // Trouver le titre de l'article parent
            const articleElement = this.closest('.blog-post');
            let articleTitle = 'Article DL-BTP & SERVICES';
            let articleText = 'Découvrez cet article intéressant';
            
            if (articleElement) {
                const titleElement = articleElement.querySelector('.blog-post-title');
                if (titleElement) {
                    articleTitle = titleElement.textContent;
                    articleText = articleTitle;
                }
            }
            
            if (navigator.share) {
                navigator.share({
                    title: articleTitle,
                    text: articleText,
                    url: window.location.href
                })
                .catch(error => console.log('Erreur de partage:', error));
            } else {
                // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
                const socialLinks = document.createElement('div');
                socialLinks.className = 'social-share-popup';
                socialLinks.innerHTML = `
                    <div class="social-share-content">
                        <button class="close-share">&times;</button>
                        <h4>Partager via</h4>
                        <div class="social-buttons">
                            <a href="https://www.facebook.com/sharer/sharer.php?u=${window.location.href}" target="_blank"><i class="fab fa-facebook-f"></i> Facebook</a>
                            <a href="https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(articleTitle)}" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>
                            <a href="https://wa.me/?text=${encodeURIComponent(articleTitle + ' ' + window.location.href)}" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                            <a href="mailto:?subject=${encodeURIComponent(articleTitle)}&body=${encodeURIComponent('Découvrez cet article: ' + window.location.href)}" target="_blank"><i class="far fa-envelope"></i> Email</a>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(socialLinks);
                
                // Style pour la popup
                const style = document.createElement('style');
                style.textContent = `
                    .social-share-popup {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.7);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                    }
                    .social-share-content {
                        background: white;
                        padding: 2rem;
                        border-radius: 0.5rem;
                        width: 90%;
                        max-width: 400px;
                        position: relative;
                    }
                    .close-share {
                        position: absolute;
                        top: 0.5rem;
                        right: 0.5rem;
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                    }
                    .social-buttons {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 1rem;
                        margin-top: 1rem;
                    }
                    .social-buttons a {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        padding: 0.75rem;
                        background: #f1f5f9;
                        color: #1e293b;
                        border-radius: 0.25rem;
                        text-decoration: none;
                        transition: all 0.3s ease;
                    }
                    .social-buttons a:hover {
                        background: #10b981;
                        color: white;
                    }
                `;
                
                document.head.appendChild(style);
                
                // Fermer la popup
                document.querySelector('.close-share').addEventListener('click', function() {
                    document.body.removeChild(socialLinks);
                    document.head.removeChild(style);
                });
            }
        });
    });
    
    // Animation d'entrée pour les éléments
    function animateOnScroll() {
        const elements = document.querySelectorAll('.blog-post, .post-card, .sidebar-widget');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialiser les styles pour l'animation
    const elements = document.querySelectorAll('.blog-post, .post-card, .sidebar-widget');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Déclencher l'animation au chargement et au défilement
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});