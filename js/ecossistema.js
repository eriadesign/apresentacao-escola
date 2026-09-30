// Ecossistema AUVP: o olho no centro e os serviços em órbita à sua volta.
// Baseado na visualização do site-vendas (eriadesign/site-vendas), usando as
// mesmas imagens. Clicar num serviço abre um popup que cresce a partir do card.
(() => {
  // Imagens relativas vêm do site-vendas publicado no GitHub Pages
  const BASE = "https://eriadesign.github.io/site-vendas/";

  const ITENS = [
    { t: "Consultoria", d: "Nº 1 no ranking do BTG Pactual, pelo segundo ano seguido.", img: "assets/img/abra-sua-conta.jpg", alt: "comunidade pro.png" },
    { t: "Conta com cartão próprio", d: "Conta, cartão e atendimento 100% AUVP, sujeito à análise de crédito.", img: "https://pbs.twimg.com/media/GxSRuKfXMAAQPsS.jpg", alt: "capa modulo 3.jpg" },
    { t: "Crédito", d: "Comparação com mais de 20 bancos, sem liquidar seus investimentos.", img: "https://cdn.asupernova.com.br/lp-auvp/vite/onde sua vida financeira se resolve mobile.webp", alt: "simulados pro.png" },
    { t: "Câmbio", d: "Enviar, receber ou investir no exterior com custo transparente.", img: "https://www.remessaonline.com.br/blog/wp-content/uploads/2022/04/servico-de-cambio.png", alt: "cripto.jpg" },
    { t: "Seguros", d: "Cotação em até 6 seguradoras, sem viés de interesse.", img: "https://images.pexels.com/photos/20880348/pexels-photo-20880348.jpeg", alt: "thumb INDICADORES.jpg" },
    { t: "Wealth", d: "Blindagem patrimonial, governança e planejamento sucessório.", img: "https://oespecialista.safra.com.br/wp-content/uploads/2026/05/wealth-management-nos-investimentos.jpg", alt: "analitica.jpg" },
    { t: "ETF's próprios", d: "AUVP11, AUPO11, AREA11 e ABTC11, geridos e baseados em metodologias próprias da AUVP.", img: "https://cdn.asupernova.com.br/lp-auvp/vite/AUVP-0509.webp", alt: "cotações.png" },
  ];

  const orbita = document.getElementById("eco-orbit");
  if (!orbita) return;

  // "assets/" é deste projeto; o resto do site-vendas
  const url = (src) => encodeURI(/^(https?:|assets\/)/.test(src) ? src : BASE + src);
  const esc = (x) => String(x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // O nome fica sempre do lado de fora da órbita: em cima, embaixo ou ao lado
  function ladoDoNome(a) {
    const rad = (a * Math.PI) / 180;
    if (Math.sin(rad) < -0.6) return "cima";
    if (Math.sin(rad) > 0.6) return "baixo";
    return Math.cos(rad) > 0 ? "dir" : "esq";
  }

  // Cada foto remota leva uma reserva local do site-vendas, usada se ela falhar
  const foto = (it) => `src="${url(it.img)}"` + (it.alt ? ` data-reserva="${url(it.alt)}"` : "");

  orbita.innerHTML =
    '<span class="orbit__ring"></span><span class="orbit__ring orbit__ring--spin"></span>' +
    `<div class="orbit__core"><img src="${BASE}olho-amarelo.svg" alt="AUVP"></div>` +
    ITENS.map((it, k) => {
      const a = -90 + (360 * k) / ITENS.length;
      return `<button type="button" class="eorb eorb--${ladoDoNome(a)}" style="--a:${a.toFixed(1)}deg;--j:${k}">` +
        `<span class="eorb-in"><img class="eorb-img" ${foto(it)} alt="" decoding="async"></span>` +
        `<b><span>${esc(it.t)}</span></b><small>${esc(it.d)}</small></button>`;
    }).join("");

  document.addEventListener("error", (e) => {
    const im = e.target;
    if (im.tagName !== "IMG" || !im.dataset.reserva) return;
    im.src = im.dataset.reserva;
    delete im.dataset.reserva;
  }, true);

  // ---------- Popup que cresce a partir do card (FLIP) ----------

  const cena = document.getElementById("eco-modal-cena");
  const modal = document.getElementById("eco-modal");
  const mImg = document.getElementById("eco-modal-img");
  const mTit = document.getElementById("eco-modal-tit");
  const mDesc = document.getElementById("eco-modal-desc");
  let origem = null;

  function transformDe(r) {
    const fr = modal.getBoundingClientRect();
    if (!fr.width || !fr.height) return "";
    const sx = r.width / fr.width, sy = r.height / fr.height;
    const tx = r.left + r.width / 2 - (fr.left + fr.width / 2);
    const ty = r.top + r.height / 2 - (fr.top + fr.height / 2);
    return `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;
  }

  function abre(btn) {
    const img = btn.querySelector(".eorb-img");
    mImg.src = img.src;
    mTit.textContent = btn.querySelector("b").textContent;
    mDesc.textContent = btn.querySelector("small").textContent;
    origem = btn;
    cena.classList.add("ver");
    cena.setAttribute("aria-hidden", "false");
    // Parte do tamanho e da posição do card e anima até o tamanho final
    modal.style.transition = "none";
    modal.style.transform = "none";
    modal.style.transform = transformDe(img.getBoundingClientRect());
    modal.offsetWidth;
    modal.style.transition = "";
    modal.style.transform = "translate(0,0) scale(1)";
  }

  function fecha() {
    if (!cena.classList.contains("ver")) return false;
    cena.classList.remove("ver");
    cena.setAttribute("aria-hidden", "true");
    if (origem) modal.style.transform = transformDe(origem.querySelector(".eorb-img").getBoundingClientRect()) || "";
    origem = null;
    return true;
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest(".eorb");
    if (b) { abre(b); return; }
    if (cena.classList.contains("ver") && (e.target.closest(".eco-modal-x") || !e.target.closest("#eco-modal"))) fecha();
  });

  // Com o popup aberto, a primeira tecla de navegação só fecha o popup
  document.addEventListener("keydown", (e) => {
    const nav = ["Escape", "ArrowRight", "ArrowLeft", "PageDown", "PageUp", " ", "Home", "End"];
    if (nav.includes(e.key) && fecha()) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
})();
