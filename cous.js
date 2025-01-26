document.addEventListener('DOMContentLoaded', function() {
  const track = document.getElementById('carouselTrack');
  const cards = Array.from(track.children);
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const dotsContainer = document.getElementById('carouselDots');

  let currentIndex = 0;
  let autoplayInterval;
  let userInteractionTimeout;
  const autoplayDelay = 3000; // Temps entre les slides en autoplay (en ms)
  const userInteractionDelay = 5000; // Temps d'attente après interaction (en ms)

  const getCardWidth = () => cards[0].getBoundingClientRect().width;

  function goToSlide(index) {
    currentIndex = index;
    const offset = -currentIndex * getCardWidth();
    track.style.transform = `translateX(${offset}px)`;
    updateDots();
  }

  function updateDots() {
    dotsContainer.childNodes.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    goToSlide((currentIndex + 1) % cards.length);
  }

  function prevSlide() {
    goToSlide((currentIndex - 1 + cards.length) % cards.length);
  }

  function handleResize() {
    goToSlide(currentIndex); // Réajuste la position en cas de redimensionnement
  }

  function startAutoplay() {
    stopAutoplay(); // Évite les doublons
    autoplayInterval = setInterval(nextSlide, autoplayDelay);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  function resetUserInteractionTimeout() {
    clearTimeout(userInteractionTimeout);
    userInteractionTimeout = setTimeout(startAutoplay, userInteractionDelay);
  }

  prevButton.addEventListener('click', () => {
    stopAutoplay();
    prevSlide();
    resetUserInteractionTimeout();
  });

  nextButton.addEventListener('click', () => {
    stopAutoplay();
    nextSlide();
    resetUserInteractionTimeout();
  });

  window.addEventListener('resize', handleResize);

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(i);
      resetUserInteractionTimeout();
    });
    dotsContainer.appendChild(dot);
  });

  track.addEventListener('touchstart', stopAutoplay); // Arrête l'autoplay sur interaction tactile
  track.addEventListener('touchend', resetUserInteractionTimeout); // Redémarre l'autoplay après délai
  track.addEventListener('mousedown', stopAutoplay); // Arrête l'autoplay sur clic
  track.addEventListener('mouseup', resetUserInteractionTimeout); // Redémarre l'autoplay après délai

  goToSlide(currentIndex);
  startAutoplay();
});