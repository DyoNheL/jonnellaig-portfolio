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

// Elements
const scrollBtn = document.getElementById("scrollTopBtn");
const footer = document.querySelector("footer");

// Scroll button eyes
const scrollLeftEye = document.getElementById("scrollLeftEye") || document.querySelector("#scrollTopBtn #leftEye");
const scrollRightEye = document.getElementById("scrollRightEye") || document.querySelector("#scrollTopBtn #rightEye");

// Main robot elements
const leftEye = document.getElementById("leftEye");
const rightEye = document.getElementById("rightEye");
const antenna = document.getElementById("antennaLight");
const robot = document.querySelector(".robot-icon");
const rightArm = document.getElementById("rightArm");

// --- Scroll to Top Button Logic ---
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        scrollBtn.classList.add("show");
        startScrollBlinking();
      } else {
        scrollBtn.classList.remove("show");
        stopScrollBlinking();
      }
    });
  },
  { threshold: 0.1 }
);

observer.observe(footer);

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Scroll button blinking
let scrollBlinkInterval;

function startScrollBlinking() {
  scrollBlinkInterval = setInterval(() => {
    scrollLeftEye.setAttribute("r", "0.1");
    scrollRightEye.setAttribute("r", "0.1");
    setTimeout(() => {
      scrollLeftEye.setAttribute("r", "1");
      scrollRightEye.setAttribute("r", "1");
    }, 150);
  }, 2000);
}

function stopScrollBlinking() {
  clearInterval(scrollBlinkInterval);
  scrollLeftEye.setAttribute("r", "1");
  scrollRightEye.setAttribute("r", "1");
}

// --- Main Robot Animation Logic ---
// Blinking eyes
setInterval(() => {
  leftEye.setAttribute("r", "0.5");
  rightEye.setAttribute("r", "0.5");
  setTimeout(() => {
    leftEye.setAttribute("r", "4");
    rightEye.setAttribute("r", "4");
  }, 150);
}, 2000);

// Antenna pulse
setInterval(() => {
  antenna.setAttribute("fill", "#ff5252");
  setTimeout(() => {
    antenna.setAttribute("fill", "#ff9b9b");
  }, 300);
}, 800);

// Bounce robot
let bounce = true;
setInterval(() => {
  robot.style.transform = bounce ? "translateY(-5px)" : "translateY(0)";
  bounce = !bounce;
}, 500);

// Wave arm
let wave = true;
setInterval(() => {
  rightArm.setAttribute("x2", wave ? "50" : "44");
  rightArm.setAttribute("y2", wave ? "25" : "30");
  rightArm.setAttribute("stroke", "#ff5252");
  wave = !wave;
}, 700);

// Robot follows mouse slightly
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 5;
  robot.style.transform = `translate(${x}px, ${y - 5}px)`;
});
