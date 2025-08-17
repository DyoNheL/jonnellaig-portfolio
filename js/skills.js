function autoScrollSkills() {
  const skillsSlider = document.querySelector(".skills-slider");
  if (!skillsSlider) return;

  let scrollAmount = 0;
  const scrollStep = 1;
  const maxScroll = skillsSlider.scrollWidth - skillsSlider.clientWidth;

  function scroll() {
    scrollAmount += scrollStep;

    if (scrollAmount > maxScroll) {
      scrollAmount = 0;
    }

    skillsSlider.scrollLeft = scrollAmount;
    requestAnimationFrame(scroll);
  }

  scroll();
}

if (window.innerWidth <= 768) {
  autoScrollSkills();
}
