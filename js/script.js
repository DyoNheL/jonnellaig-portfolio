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
