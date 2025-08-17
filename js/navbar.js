function toggleMenu() {
  const menu = document.querySelector('.nav-links');
  const toggleIcon = document.querySelector('.menu-toggle');
  menu.classList.toggle('active');
  toggleIcon.textContent = menu.classList.contains('active') ? '✖' : '☰';
}

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.querySelector('.nav-links');
    const toggleIcon = document.querySelector('.menu-toggle');
    menu.classList.remove('active'); // close menu
    toggleIcon.textContent = '☰';   // reset icon
  });
});

// Highlight active nav on click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

// Highlight active section while scrolling
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