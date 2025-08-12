(function () {
  const viewport = document.querySelector(".carousel-viewport");
  const track = document.querySelector(".projects-track");
  const cards = Array.from(document.querySelectorAll(".project-card"));
  const dotsContainer = document.querySelector(".carousel-dots");

  if (!viewport || cards.length === 0) return;

  let currentIndex = 0;
  let slideWidth = 0;
  let gap = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationFrameId = 0;
  let autoSlideTimer = null;
  const AUTO_DELAY = 10000;
  const SNAP_THRESHOLD = 0.2;

  // build dots
  cards.forEach((_, i) => {
    const btn = document.createElement("button");
    if (i === 0) btn.classList.add("active");
    btn.addEventListener("click", () => {
      goToSlide(i);
      resetAutoplay();
    });
    dotsContainer.appendChild(btn);
  });

  const dots = Array.from(dotsContainer.children);

  // compute sizes
  function updateSizes() {
    const rect = cards[0].getBoundingClientRect();
    slideWidth = rect.width;
    const computedGap =
      getComputedStyle(track).gap ||
      getComputedStyle(track).columnGap ||
      "30px";
    gap = parseFloat(computedGap) || 30;
  }

  // reposition after resize
  window.addEventListener("resize", () => {
    updateSizes();
    setTranslate(-currentIndex * (slideWidth + gap));
  });

  updateSizes();

  function setTranslate(x) {
    track.style.transform = `translateX(${x}px)`;
  }

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
  }

  function goToSlide(index) {
    currentIndex = (index + cards.length) % cards.length;
    const x = -currentIndex * (slideWidth + gap);
    track.style.transition = "transform 0.45s ease";
    setTranslate(x);
    prevTranslate = x;
    updateDots();
  }

  // autoplay
  function startAutoplay() {
    stopAutoplay();
    autoSlideTimer = setInterval(() => {
      goToSlide((currentIndex + 1) % cards.length);
    }, AUTO_DELAY);
  }
  function stopAutoplay() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }
  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // drag handlers (pointer events)
  viewport.addEventListener("pointerdown", pointerDown);
  viewport.addEventListener("pointermove", pointerMove);
  viewport.addEventListener("pointerup", pointerUp);
  viewport.addEventListener("pointerleave", pointerUp);
  viewport.addEventListener("pointercancel", pointerUp);

  function pointerDown(e) {
    // only left click or touch
    if (e.pointerType === "mouse" && e.button !== 0) return;
    isDragging = true;
    startX = e.clientX;
    track.style.transition = "none";
    prevTranslate = -currentIndex * (slideWidth + gap);
    stopAutoplay();

    // capture pointer so we get events outside the element
    viewport.setPointerCapture && viewport.setPointerCapture(e.pointerId);
  }

  function pointerMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    currentTranslate = prevTranslate + dx;
    setTranslate(currentTranslate);
  }

  function pointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    const dx = (e.clientX || startX) - startX;
    const movedFraction = Math.abs(dx) / (slideWidth + gap);

    // snap logic
    if (dx < 0 && movedFraction > SNAP_THRESHOLD) {
      // moved left -> next
      goToSlide(currentIndex + 1);
    } else if (dx > 0 && movedFraction > SNAP_THRESHOLD) {
      // moved right -> prev
      goToSlide(currentIndex - 1);
    } else {
      // snap back
      goToSlide(currentIndex);
    }

    resetAutoplay();
    try {
      viewport.releasePointerCapture &&
        viewport.releasePointerCapture(e.pointerId);
    } catch (err) {}
  }

  // allow keyboard nav (optional)
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      goToSlide(currentIndex + 1);
      resetAutoplay();
    }
    if (e.key === "ArrowLeft") {
      goToSlide(currentIndex - 1);
      resetAutoplay();
    }
  });

  // touch devices: tap on card toggles buttons (so users can reveal the buttons)
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isTouch) {
    cards.forEach((card) => {
      card.addEventListener("click", (ev) => {
        // if clicking a button inside card, let it proceed
        if (ev.target.closest(".card-buttons")) return;
        // toggle display
        cards.forEach((c) => c.classList.remove("show-buttons"));
        card.classList.toggle("show-buttons");
      });
    });

    // click outside to hide buttons
    document.addEventListener("click", (ev) => {
      if (!ev.target.closest(".project-card")) {
        cards.forEach((c) => c.classList.remove("show-buttons"));
      }
    });
  }

  // prevent image dragging
  cards.forEach((imgCard) => {
    const imgs = imgCard.querySelectorAll("img");
    imgs.forEach((img) => (img.ondragstart = () => false));
  });

  // init
  goToSlide(0);
  startAutoplay();
})();
