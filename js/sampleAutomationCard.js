(function () {
  document.querySelectorAll(".tab-content").forEach((tab) => {
    const viewport = tab.querySelector(".carousel-viewport") || tab;
    const track = tab.querySelector(".projects-track");
    const cards = Array.from(tab.querySelectorAll(".project-card"));
    const dotsContainer = tab.querySelector(".carousel-dots");

    if (!viewport || cards.length === 0) return;

    let currentIndex = 0;
    let slideWidth = 0;
    let gap = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let autoSlideTimer = null;
    const AUTO_DELAY = 5000;
    const SNAP_THRESHOLD = 0.2;

    // clear old dots & build new for this tab
    dotsContainer.innerHTML = "";
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

    function updateSizes() {
      const rect = cards[0].getBoundingClientRect();
      slideWidth = rect.width;
      const computedGap =
        getComputedStyle(track).gap ||
        getComputedStyle(track).columnGap ||
        "30px";
      gap = parseFloat(computedGap) || 30;
    }

    window.addEventListener("resize", () => {
      updateSizes();
      setTranslate(-currentIndex * (slideWidth + gap));
    });

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

    // Drag handlers
    viewport.addEventListener("pointerdown", pointerDown);
    viewport.addEventListener("pointermove", pointerMove);
    viewport.addEventListener("pointerup", pointerUp);
    viewport.addEventListener("pointerleave", pointerUp);
    viewport.addEventListener("pointercancel", pointerUp);

    function pointerDown(e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      isDragging = true;
      startX = e.clientX;
      track.style.transition = "none";
      prevTranslate = -currentIndex * (slideWidth + gap);
      stopAutoplay();
      viewport.setPointerCapture?.(e.pointerId);
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
      if (dx < 0 && movedFraction > SNAP_THRESHOLD) {
        goToSlide(currentIndex + 1);
      } else if (dx > 0 && movedFraction > SNAP_THRESHOLD) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(currentIndex);
      }
      resetAutoplay();
      try {
        viewport.releasePointerCapture?.(e.pointerId);
      } catch {}
    }

    // Keyboard nav
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

    // Touch toggle card buttons
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      cards.forEach((card) => {
        card.addEventListener("click", (ev) => {
          if (ev.target.closest(".card-buttons")) return;
          cards.forEach((c) => c.classList.remove("show-buttons"));
          card.classList.toggle("show-buttons");
        });
      });
      document.addEventListener("click", (ev) => {
        if (!ev.target.closest(".project-card")) {
          cards.forEach((c) => c.classList.remove("show-buttons"));
        }
      });
    }

    // Prevent image drag
    cards.forEach((imgCard) => {
      imgCard.querySelectorAll("img").forEach((img) => {
        img.ondragstart = () => false;
      });
    });

    // Init
    updateSizes();
    goToSlide(0);
    startAutoplay();
  });
})();

// Tab switching
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    tabContents.forEach((content) => content.classList.remove("active"));
    const target = button.getAttribute("data-tab");
    document
      .querySelector(`[data-tab-content="${target}"]`)
      .classList.add("active");
  });
});
