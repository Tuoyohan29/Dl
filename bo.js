document.addEventListener('DOMContentLoaded', function() {
    // Variables pour la galerie d'images
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const likeBtn = document.getElementById('like-btn');
    const likeCount = document.getElementById('like-count');
    
    // Images de la galerie (à remplacer par vos propres images)
    const galleryImages = [
        'b1.jpg',
        'b2.jpg',
        'b3.jpg',
        'b4.jpg'
    ];
    
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
    prevBtn.addEventListener('click', function() {
        changeImage(currentImageIndex - 1);
    });
    
    nextBtn.addEventListener('click', function() {
        changeImage(currentImageIndex + 1);
    });
    
    // Événements pour les miniatures
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            changeImage(index);
        });
    });
    
    // Événement pour le bouton "J'aime"
    likeBtn.addEventListener('click', function() {
        isLiked = !isLiked;
        
        if (isLiked) {
            likeBtn.classList.add('liked');
            likeBtn.innerHTML = '<i class="fas fa-heart"></i> <span id="like-count">' + (parseInt(likeCount.textContent) + 1) + '</span>';
        } else {
            likeBtn.classList.remove('liked');
            likeBtn.innerHTML = '<i class="far fa-heart"></i> <span id="like-count">' + (parseInt(likeCount.textContent) - 1) + '</span>';
        }
        
        // Animation de pulsation
        likeBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            likeBtn.style.transform = 'scale(1)';
        }, 200);
    });
    
    // Animation au survol des cartes d'articles
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('img').style.transform = 'scale(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('img').style.transform = 'scale(1)';
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
    
    // Bouton de partage
    const shareBtn = document.querySelector('.share-btn');
    shareBtn.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'Visite de chantier à Akeikoi et N\'dotre',
                text: 'Une visite de chantier avec le coordinateur du PUCA et d\'autres partenaires',
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
                        <a href="https://twitter.com/intent/tweet?url=${window.location.href}&text=Visite de chantier à Akeikoi et N'dotre" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>
                        <a href="https://wa.me/?text=Visite de chantier à Akeikoi et N'dotre ${window.location.href}" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                        <a href="mailto:?subject=Visite de chantier à Akeikoi et N'dotre&body=Découvrez cet article: ${window.location.href}" target="_blank"><i class="far fa-envelope"></i> Email</a>
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
    
    // Diaporama automatique pour la galerie principale
    let slideInterval = setInterval(() => {
        changeImage(currentImageIndex + 1);
    }, 5000);
    
    // Arrêter le diaporama lorsque l'utilisateur interagit avec la galerie
    const galleryContainer = document.querySelector('.blog-post-gallery');
    galleryContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    galleryContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            changeImage(currentImageIndex + 1);
        }, 5000);
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