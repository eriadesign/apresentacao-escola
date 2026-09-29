// Ecossistema em órbitas, reproduzido do site-vendas (eriadesign/site-vendas).
// O olho fica no centro, ligado por um fio a cada frente; cada frente é um
// disco com os produtos em volta, como satélites. Clicar num produto abre um
// popup que cresce a partir do próprio card.
(() => {
  // Imagens relativas vêm do site-vendas publicado no GitHub Pages
  const BASE = "https://eriadesign.github.io/site-vendas/";

  const ECOS = [
    {
      mote: "Você aprende\nna prática",
      itens: [
        { t: "Módulos Avançados", d: "Análise de Setores, Geopolítica, Indicadores e Aulas Técnicas para quem quer ir além da grade principal.", img: "modulos avançados.jpg" },
        { t: "Ferramentas", d: "Quatro ferramentas próprias para apoiar seus estudos e a gestão da carteira.", img: "https://raw.githubusercontent.com/design-auvp/projetodelta/main/Analise-de-ações-e-indicadores-AUVP-Analítica.png", topo: true, alt: "trilha pro.png" },
        { t: "Atualização de Mercado - Semanal", d: "Toda segunda-feira, às 19h, ao vivo com o Raul Sena comentando o que mexeu com o mercado.", img: "lives.jpg" },
        { t: "A Escola", d: "O treinamento completo da AUVP: mais de 100 aulas, sete módulos para você ir do zero à liberdade financeira.", img: "raul explicativo.png", alt: "aulas att.png" },
        { t: "Módulo Internacional", d: "Aprenda sobre Renda Fixa Internacional, stocks, REITs e Private Equity: como investir fora do Brasil.", img: "https://www.remessaonline.com.br/blog/wp-content/uploads/2024/07/como-investir-no-exterior.jpg", alt: "internacional.jpg" },
      ],
    },
    {
      mote: "Nós cuidamos da sua\nvida financeira",
      itens: [
        { t: "Consultoria", d: "Nº 1 no ranking do BTG Pactual, pelo segundo ano seguido.", img: "https://www.maisnovela.com.br/wp-content/uploads/2026/03/AUVP.png", alt: "comunidade pro.png" },
        { t: "Conta com cartão próprio", d: "Conta, cartão e atendimento 100% AUVP, sujeito à análise de crédito.", img: "https://pbs.twimg.com/media/GxSRuKfXMAAQPsS.jpg", alt: "capa modulo 3.jpg" },
        { t: "Crédito", d: "Comparação com mais de 20 bancos, sem liquidar seus investimentos.", img: "https://cdn.asupernova.com.br/lp-auvp/vite/onde sua vida financeira se resolve mobile.webp", alt: "simulados pro.png" },
        { t: "Câmbio", d: "Enviar, receber ou investir no exterior com custo transparente.", img: "https://www.remessaonline.com.br/blog/wp-content/uploads/2022/04/servico-de-cambio.png", alt: "cripto.jpg" },
        { t: "Seguros", d: "Cotação em até 6 seguradoras, sem viés de interesse.", img: "https://images.pexels.com/photos/20880348/pexels-photo-20880348.jpeg", alt: "thumb INDICADORES.jpg" },
        { t: "Wealth", d: "Blindagem patrimonial, governança e planejamento sucessório.", img: "https://oespecialista.safra.com.br/wp-content/uploads/2026/05/wealth-management-nos-investimentos.jpg", alt: "analitica.jpg" },
        { t: "ETF's próprios", d: "AUVP11, AUPO11, AREA11 e ABTC11, geridos e baseados em metodologias próprias da AUVP.", img: "https://cdn.asupernova.com.br/lp-auvp/vite/AUVP-0509.webp", alt: "cotações.png" },
      ],
    },
  ];

  const grupos = document.getElementById("eco-grupos");
  if (!grupos) return;

  const url = (src) => encodeURI(/^https?:/.test(src) ? src : BASE + src);
  const esc = (x) => String(x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // Cada foto remota leva uma reserva local do site-vendas, usada se ela falhar
  const foto = (it) =>
    `src="${url(it.img)}"` +
    (it.alt ? ` data-reserva="${url(it.alt)}"` : "") +
    (it.topo ? ' style="object-position:top"' : "");

  function frente(g, gi) {
    const n = g.itens.length;
    // Os satélites ocupam um arco de 280°, deixando livre o setor voltado para o olho
    const inicio = (gi ? 180 : 0) + 40;
    return `<div class="eco-frente" style="--fator:${n > 5 ? 1.32 : 1}">` +
      `<div class="eco-disco"><b>${esc(g.mote).replace(/\n/g, "<br>")}</b></div>` +
      g.itens.map((it, k) => {
        const a = inicio + (n > 1 ? (280 * k) / (n - 1) : 140);
        const cima = Math.sin((a * Math.PI) / 180) < 0 ? " cima" : "";
        return `<button type="button" class="eorb${cima}" style="--a:${a.toFixed(1)}deg;--j:${gi * 6 + k}">` +
          `<span class="eorb-in"><img class="eorb-img" ${foto(it)} alt="" decoding="async"></span>` +
          `<b><span>${esc(it.t)}</span></b><small>${esc(it.d)}</small></button>`;
      }).join("") +
      "</div>";
  }

  grupos.innerHTML =
    frente(ECOS[0], 0) +
    '<span class="eco-fio"></span>' +
    `<div class="eco-olho"><img src="${BASE}olho-amarelo.svg" alt=""></div>` +
    '<span class="eco-fio"></span>' +
    frente(ECOS[1], 1);

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
    mImg.src = btn.querySelector(".eorb-img").src;
    mImg.style.objectPosition = btn.querySelector(".eorb-img").style.objectPosition || "";
    mTit.textContent = btn.querySelector("b").textContent;
    mDesc.textContent = btn.querySelector("small").textContent;
    origem = btn;
    cena.classList.add("ver");
    cena.setAttribute("aria-hidden", "false");
    // Parte do tamanho e da posição do card e anima até o tamanho final
    modal.style.transition = "none";
    modal.style.transform = "none";
    modal.style.transform = transformDe(btn.getBoundingClientRect());
    modal.offsetWidth;
    modal.style.transition = "";
    modal.style.transform = "translate(0,0) scale(1)";
  }

  function fecha() {
    if (!cena.classList.contains("ver")) return false;
    cena.classList.remove("ver");
    cena.setAttribute("aria-hidden", "true");
    if (origem) modal.style.transform = transformDe(origem.getBoundingClientRect()) || "";
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
