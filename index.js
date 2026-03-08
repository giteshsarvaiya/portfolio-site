// Theme toggle (guarded so script works on pages that don't have the button)
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("data-theme", newTheme);
    themeToggle.textContent = newTheme === "dark" ? "Light" : "Dark";
  });
}

// Apply saved theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("data-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  if (themeToggle) themeToggle.textContent = savedTheme === "dark" ? "Light" : "Dark";
});

// Scroll progress bar + back to top
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Diagram box click-to-scroll
document.querySelectorAll(".diagram-box").forEach((box) => {
  box.addEventListener("click", () => {
    var target = document.getElementById(box.dataset.target);
    if (!target) return;
    target.open = true;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("diagram-target-highlight");
    setTimeout(() => target.classList.remove("diagram-target-highlight"), 1000);
  });
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (scrollProgress) {
    scrollProgress.style.width = percent + "%";
  }

  if (backToTop) {
    if (scrollTop > 300) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }
});

// ── Active TOC link on scroll ──────────────────────────────────────────────
(function () {
  const tocLinks = document.querySelectorAll('.toc-list a[href^="#"], .toc-sidebar-list a[href^="#"]');
  if (!tocLinks.length) return;

  const sectionIds = Array.from(tocLinks)
    .map(a => a.getAttribute('href').slice(1))
    .filter(id => document.getElementById(id));

  function updateActiveTOC() {
    let currentId = sectionIds[0];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= 130) currentId = id;
    }
    tocLinks.forEach(a => a.classList.remove('toc-active'));
    const activeLink = document.querySelectorAll(`.toc-list a[href="#${currentId}"], .toc-sidebar-list a[href="#${currentId}"]`);
    activeLink.forEach(a => a.classList.add('toc-active'));
  }

  window.addEventListener('scroll', updateActiveTOC, { passive: true });
  updateActiveTOC();
})();
