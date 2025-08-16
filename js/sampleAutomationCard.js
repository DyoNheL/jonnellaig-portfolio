document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll(".carousel-viewport");
  const tabButtons = document.querySelectorAll(".tab-btn");

  carousels.forEach(initCarousel);

  function initCarousel(carousel) {
    const track = carousel.querySelector(".projects-track");
    const cards = carousel.querySelectorAll(".project-card");
    if (!track || cards.length === 0) return;

    let dotsContainer = carousel.querySelector(".carousel-dots");
    if (!dotsContainer) {
      dotsContainer = document.createElement("div");
      dotsContainer.className = "carousel-dots";
      carousel.appendChild(dotsContainer);
    }

    let currentIndex = 0;
    let autoSlideInterval = null;
    let cardsPerPage = getCardsPerPage();
    let totalPages = Math.max(1, Math.ceil(cards.length / cardsPerPage));
    let dots = [];

    buildDots();
    moveToSlide(0, false);
    startAutoSlide();

    function getCardsPerPage() {
      return window.innerWidth <= 768 ? 1 : 3;
    }
    function getGap() {
      const g = window.getComputedStyle(track).gap || "0";
      const n = parseFloat(g);
      return Number.isFinite(n) ? n : 0;
    }
    function getCardWidth() {
      return cards[0]?.offsetWidth || 0;
    }
    function clamp(n, min, max) {
      return Math.min(Math.max(n, min), max);
    }

    function buildDots() {
      dotsContainer.innerHTML = "";
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "dot" + (i === currentIndex ? " active" : "");
        dot.addEventListener("click", () => moveToSlide(i));
        dotsContainer.appendChild(dot);
      }
      dots = Array.from(dotsContainer.querySelectorAll(".dot"));
    }

    function updateDots() {
      dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
    }

    function moveToSlide(index, animate = true) {
      currentIndex = clamp(index, 0, totalPages - 1);

      const cardWidth = getCardWidth();
      const gap = getGap();

      if (!animate) track.style.transition = "none";
      else track.style.transition = "";

      let offset;
      if (cardsPerPage === 1) {
        offset = currentIndex * (cardWidth + gap);
      } else {
        offset = currentIndex * ((cardWidth + gap) * cardsPerPage);
      }

      track.style.transform = `translateX(-${offset}px)`;
      updateDots();

      if (!animate) requestAnimationFrame(() => (track.style.transition = ""));
    }

    function autoSlide() {
      if (totalPages < 2) return;
      moveToSlide((currentIndex + 1) % totalPages);
    }
    function startAutoSlide() {
      stopAutoSlide();
      if (totalPages > 1) autoSlideInterval = setInterval(autoSlide, 4000);
    }
    function stopAutoSlide() {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }

    // ---- swipe (touch) + drag (mouse) ----
    let isDragging = false;
    let dragStartX = 0;
    let dragDiff = 0;
    const SWIPE_THRESHOLD = 50;

    // Mobile touch
    carousel.addEventListener(
      "touchstart",
      (e) => {
        if (!e.touches || e.touches.length === 0) return;
        dragStartX = e.touches[0].clientX;
        dragDiff = 0;
        isDragging = true;
        stopAutoSlide();
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging || !e.touches || e.touches.length === 0) return;
        dragDiff = e.touches[0].clientX - dragStartX;
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchend",
      () => {
        if (!isDragging) return;
        isDragging = false;
        handleSwipeRelease();
        startAutoSlide();
      },
      { passive: true }
    );

    // Desktop mouse drag
    carousel.addEventListener("mousedown", (e) => {
      // only left click
      if (e.button !== 0) return;
      e.preventDefault();
      dragStartX = e.clientX;
      dragDiff = 0;
      isDragging = true;
      stopAutoSlide();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      dragDiff = e.clientX - dragStartX;
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      handleSwipeRelease();
      startAutoSlide();
    });

    function handleSwipeRelease() {
      if (Math.abs(dragDiff) > SWIPE_THRESHOLD) {
        if (dragDiff > 0) {
          moveToSlide(currentIndex - 1);
        } else {
          moveToSlide(currentIndex + 1);
        }
      }
      dragDiff = 0;
    }

    // Pause on hover (desktop)
    carousel.addEventListener("mouseenter", stopAutoSlide);
    carousel.addEventListener("mouseleave", startAutoSlide);

    // Recalculate on resize
    window.addEventListener("resize", () => {
      const prevCardsPerPage = cardsPerPage;
      cardsPerPage = getCardsPerPage();
      totalPages = Math.max(1, Math.ceil(cards.length / cardsPerPage));

      // keep the first visible page consistent
      currentIndex = clamp(currentIndex, 0, totalPages - 1);

      buildDots();
      moveToSlide(currentIndex, false);

      // autoplay rules might change if page count collapsed to 1
      if (totalPages < 2) stopAutoSlide();
      else if (!autoSlideInterval) startAutoSlide();
    });
  }

  // ---- Tab switching ----
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;

      tabButtons.forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => {
        c.classList.remove("active");
      });

      btn.classList.add("active");
      document
        .querySelector(`[data-tab-content="${tabName}"]`)
        .classList.add("active");
    });
  });
});
