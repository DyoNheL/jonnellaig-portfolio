document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".project-card");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-show");
                observer.unobserve(entry.target); // run only once
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));
});