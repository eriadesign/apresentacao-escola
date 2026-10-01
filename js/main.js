(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const dotsEl = document.querySelector(".dots");
  const counterEl = document.querySelector(".counter");
  const progressEl = document.querySelector(".progress__bar");
  const blockEl = document.querySelector(".topbar__block");
  const prevBtn = document.querySelector('[data-action="prev"]');
  const nextBtn = document.querySelector('[data-action="next"]');
  const LINKS = window.AUVP_LINKS || {};

  let current = -1;

  // ---------- Navegação ----------

  const dots = slides.map((slide, i) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Ir para ${slide.dataset.title || `slide ${i + 1}`}`);
    dot.title = slide.dataset.title || "";
    dot.addEventListener("click", () => goTo(i));
    dotsEl.appendChild(dot);
    return dot;
  });

  const fragmentsOf = (slide) => [...slide.querySelectorAll(".fragment")];

  // showFragments: ao voltar de um slide, o anterior aparece completo
  function goTo(index, { showFragments = false } = {}) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    if (index === current) return;

    const slide = slides[index];
    fragmentsOf(slide).forEach((f) => f.classList.toggle("is-visible", showFragments));

    slides.forEach((s, i) => {
      s.classList.toggle("is-active", i === index);
      s.classList.toggle("is-past", i < index);
      s.setAttribute("aria-hidden", i !== index);
    });
    dots.forEach((dot, i) => dot.setAttribute("aria-selected", i === index));

    counterEl.textContent = `${index + 1} / ${slides.length}`;
    progressEl.style.width = `${((index + 1) / slides.length) * 100}%`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;
    blockEl.textContent = slide.dataset.block || "";
    document.body.classList.toggle("chrome-off", slide.dataset.chrome === "off");

    // Vídeos tocam só no slide ativo, sempre do começo
    document.querySelectorAll(".slide video").forEach((video) => {
      if (slide.contains(video)) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });

    current = index;
    history.replaceState(null, "", `#${index + 1}`);
  }

  function next() {
    const pending = fragmentsOf(slides[current]).find((f) => !f.classList.contains("is-visible"));
    if (pending) pending.classList.add("is-visible");
    else goTo(current + 1);
  }

  function prev() {
    const shown = fragmentsOf(slides[current]).filter((f) => f.classList.contains("is-visible"));
    if (shown.length) shown.at(-1).classList.remove("is-visible");
    else goTo(current - 1, { showFragments: true });
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);
  document.querySelector('[data-action="fullscreen"]').addEventListener("click", toggleFullscreen);

  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
        e.preventDefault(); next(); break;
      case " ":
        // Espaço em cima de um botão deve acionar o botão, não avançar
        if (e.target.closest("button, a")) return;
        e.preventDefault(); next(); break;
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault(); prev(); break;
      case "Home": goTo(0); break;
      case "End": goTo(slides.length - 1); break;
      case "f":
      case "F": toggleFullscreen(); break;
      case "t":
      case "T": document.body.classList.toggle("hide-todo"); break;
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

  // ---------- Links (js/config.js) ----------

  document.querySelectorAll("[data-link]").forEach((el) => {
    const url = LINKS[el.dataset.link];
    if (url) {
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      el.classList.add("is-pending");
      el.title = `Link pendente: preencha "${el.dataset.link}" em js/config.js`;
      el.addEventListener("click", (e) => e.preventDefault());
    }
  });

  // ---------- Prints: sem imagem, fica o placeholder ----------

  document.querySelectorAll(".shot__screen img, .account__photo img").forEach((img) => {
    const fail = () => img.remove();
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener("error", fail);
  });

  // ---------- Abas (ferramentas, planos, ecossistema) ----------

  document.querySelectorAll("[data-tabs]").forEach((group) => {
    const tabs = [...group.querySelectorAll("[data-tab]")];
    const panels = [...group.querySelectorAll("[data-panel]")];
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.setAttribute("aria-selected", t === tab));
        panels.forEach((p) => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
      });
    });
  });

  // Ferramentas: marca como "visitada" ao abrir o link
  document.querySelectorAll(".tools__panel").forEach((panel) => {
    panel.querySelectorAll("[data-link]").forEach((link) => {
      link.addEventListener("click", () => {
        if (link.classList.contains("is-pending")) return;
        document.querySelector(`.tools__tab[data-tab="${panel.dataset.panel}"]`)?.classList.add("is-visited");
      });
    });
  });

  // ---------- Tarefa de casa ----------

  document.querySelectorAll(".hw").forEach((task) => {
    task.addEventListener("click", () => {
      task.setAttribute("aria-pressed", task.getAttribute("aria-pressed") !== "true");
    });
  });

  // ---------- Vantagens: "abrir conta" desbloqueia ----------

  document.querySelectorAll("[data-unlock]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".slide").querySelector(".perks")?.classList.add("is-visible");
    });
  });

  goTo(readHash());
})();
