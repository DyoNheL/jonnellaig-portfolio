// Initialize AOS after page load
document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 800,
    easing: "ease-out",
    once: false,
  });

  // Initialize Particles.js
  particlesJS("particles-js", {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: "#00d4ff" },
      shape: { type: "circle" },
      opacity: { value: 0.5 },
      size: { value: 3 },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#00d4ff",
        opacity: 0.4,
        width: 1,
      },
      move: { enable: true, speed: 2 },
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
      },
      modes: { grab: { distance: 200, line_linked: { opacity: 0.6 } } },
    },
    retina_detect: true,
  });
});

// Scroll to Top Button
const scrollBtn = document.getElementById("scrollTopBtn");
const footer = document.querySelector("footer");
const leftEye = document.getElementById("leftEye");
const rightEye = document.getElementById("rightEye");

// Intersection Observer to detect footer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        scrollBtn.classList.add("show");
        startBlinking();
      } else {
        scrollBtn.classList.remove("show");
        stopBlinking();
      }
    });
  },
  { threshold: 0.1 }
);

observer.observe(footer);

// Scroll to top
scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Eye blink interval
let blinkInterval;

function startBlinking() {
  blinkInterval = setInterval(() => {
    leftEye.setAttribute("r", "0.1");
    rightEye.setAttribute("r", "0.1");
    setTimeout(() => {
      leftEye.setAttribute("r", "1");
      rightEye.setAttribute("r", "1");
    }, 150);
  }, 2000);
}

function stopBlinking() {
  clearInterval(blinkInterval);
  leftEye.setAttribute("r", "1");
  rightEye.setAttribute("r", "1");
}
