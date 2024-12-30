
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }
        
        slides[currentSlide].classList.add('active');
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    prevButton.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        resetAutoSlide();
    });

    nextButton.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        resetAutoSlide();
    });

    // Gestion du swipe sur mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.querySelector('.carousel').addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoSlideInterval);
    });

    document.querySelector('.carousel').addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeLength = touchEndX - touchStartX;
        
        if (Math.abs(swipeLength) > swipeThreshold) {
            if (swipeLength > 0) {
                showSlide(currentSlide - 1);
            } else {
                showSlide(currentSlide + 1);
            }
        }
    }

    // Démarrer le carousel et l'autoplay
    showSlide(0);
    startAutoSlide();
});