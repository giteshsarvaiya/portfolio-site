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

// ── Recommendations carousel ──────────────────────────────────────────────
(function () {
  var cards = document.querySelectorAll('.rec-card');
  var dots  = document.querySelectorAll('#recDots .rec-dot');
  var prev  = document.getElementById('recPrev');
  var next  = document.getElementById('recNext');
  if (!cards.length) return;

  var current = 0;
  var total   = cards.length;
  var timer;
  var startX  = 0;

  function goTo(index) {
    cards[current].classList.remove('rec-card-active');
    dots[current].classList.remove('rec-dot-active');
    current = ((index % total) + total) % total;
    cards[current].classList.add('rec-card-active');
    dots[current].classList.add('rec-dot-active');
  }

  function startAuto() {
    timer = setInterval(function () { goTo(current + 1); }, 5000);
  }

  function resetAuto() { clearInterval(timer); startAuto(); }

  if (prev) prev.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
  if (next) next.addEventListener('click', function () { goTo(current + 1); resetAuto(); });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.dataset.index, 10));
      resetAuto();
    });
  });

  // Show "View more" only when quote is actually clamped
  cards.forEach(function (card) {
    var quote = card.querySelector('.rec-quote');
    var btn   = card.querySelector('.rec-expand-btn');
    if (!quote || !btn) return;

    function checkClamp() {
      if (quote.classList.contains('rec-expanded')) return;
      btn.hidden = quote.scrollHeight <= quote.clientHeight + 2;
    }

    checkClamp();
    window.addEventListener('resize', checkClamp);

    btn.addEventListener('click', function () {
      var expanded = quote.classList.toggle('rec-expanded');
      btn.textContent = expanded ? 'Hide' : 'View more';
    });
  });

  // Swipe support
  var section = document.getElementById('recSection');
  if (section) {
    section.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    section.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 48) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
    }, { passive: true });
  }

  startAuto();
})();

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
