function toggleTimeline(element) {
  const list = element.querySelector(".details-list");
  if (!list) return;

  if (list.style.display === "block") {
    list.style.display = "none";
  } else {
    document.querySelectorAll(".details-list").forEach((l) => {
      l.style.display = "none";
    });
    list.style.display = "block";
  }
}

function toggleProject(element) {
  const desc = element.querySelector(".project-desc");
  if (!desc) return;

  if (desc.style.display === "block") {
    desc.style.display = "none";
  } else {
    document.querySelectorAll(".project-desc").forEach((d) => {
      d.style.display = "none";
    });
    desc.style.display = "block";
  }
}
