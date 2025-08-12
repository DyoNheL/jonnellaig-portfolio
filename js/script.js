// START NAVBAR //

function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
}

// Close menu when a link is clicked (Mobile)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Highlight active nav on click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

// OPTIONAL: Highlight active section while scrolling
window.addEventListener('scroll', () => {
    let fromTop = window.scrollY + 100;

    document.querySelectorAll('.nav-link').forEach(link => {
        let section = document.querySelector(link.getAttribute('href'));

        if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// END NAVBAR //

// START MODAL //

function openModal(id) {
    document.getElementById(id).style.display = "block";
}
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}
window.onclick = function(event) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}

// END MODAL //

// START PROJECT //

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

// END MODAL //


