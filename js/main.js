(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const dotsEl = document.querySelector(".dots");
  const counterEl = document.querySelector(".counter");
  const progressEl = document.querySelector(".progress__bar");
  const prevBtn = document.querySelector('[data-action="prev"]');
  const nextBtn = document.querySelector('[data-action="next"]');
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let current = -1;

  // ---------- Navegação ----------

  const dots = slides.map((slide, i) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Ir para ${slide.dataset.title || `slide ${i + 1}`}`);
    dot.addEventListener("click", () => goTo(i));
    dotsEl.appendChild(dot);
    return dot;
  });

  function goTo(index) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    if (index === current) return;

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
      slide.classList.toggle("is-past", i < index);
      slide.setAttribute("aria-hidden", i !== index);
    });
    dots.forEach((dot, i) => dot.setAttribute("aria-selected", i === index));

    counterEl.textContent = `${index + 1} / ${slides.length}`;
    progressEl.style.width = `${((index + 1) / slides.length) * 100}%`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;

    current = index;
    history.replaceState(null, "", `#${index + 1}`);
    onEnter(slides[index]);
  }

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);
  document.querySelector('[data-action="fullscreen"]').addEventListener("click", toggleFullscreen);
  document.querySelectorAll("[data-goto]").forEach((el) =>
    el.addEventListener("click", () => goTo(Number(el.dataset.goto)))
  );

  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
        e.preventDefault(); next(); break;
      case " ":
        // Espaço em cima de um botão deve acionar o botão, não avançar
        if (e.target.closest("button")) return;
        e.preventDefault(); next(); break;
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault(); prev(); break;
      case "Home": goTo(0); break;
      case "End": goTo(slides.length - 1); break;
      case "f":
      case "F": toggleFullscreen(); break;
    }
  });

  // Swipe em telas de toque
  let touchX = null;
  document.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchX = null;
  });

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  }

  window.addEventListener("hashchange", () => goTo(readHash()));

  function readHash() {
    const n = parseInt(location.hash.slice(1), 10);
    return Number.isNaN(n) ? 0 : n - 1;
  }

  // ---------- Interações dos slides ----------

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const open = card.getAttribute("aria-expanded") === "true";
      card.setAttribute("aria-expanded", !open);
    });
  });

  document.querySelectorAll(".timeline").forEach((timeline) => {
    const items = [...timeline.querySelectorAll(".timeline__item")];
    items.forEach((item) => {
      item.querySelector(".timeline__year").addEventListener("click", () => {
        items.forEach((other) => other.classList.toggle("is-active", other === item));
      });
    });
  });

  function onEnter(slide) {
    slide.querySelectorAll("[data-count]").forEach(animateCount);
  }

  function animateCount(el) {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const format = (n) => n.toLocaleString("pt-BR") + suffix;

    if (reduceMotion) { el.textContent = format(target); return; }

    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  goTo(readHash());
})();
