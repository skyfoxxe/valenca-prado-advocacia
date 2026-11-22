// Valença & Prado — v6
// Para um escritório real, preencha (só dígitos, com DDI e DDD, ex.: '5565999999999')
// e o e-mail. Vazios = modo demonstração (abre o diálogo com a mensagem).
const WHATSAPP_NUMBER = '';
const CONTACT_EMAIL = '';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hasIO = 'IntersectionObserver' in window;

// ---------- Menu ----------
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
if (toggle && nav) {
  const setNav = open => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Fechar' : 'Menu';
  };
  toggle.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); toggle.focus(); }
  });
}

// ---------- Cabeçalho: linha fina aparece depois da abertura ----------
const topBar = document.querySelector('[data-top]');
const heroGrid = document.querySelector('.hero-grid');
if (topBar && heroGrid && hasIO) {
  new IntersectionObserver(([e]) => topBar.classList.toggle('is-stuck', !e.isIntersecting), {
    rootMargin: '-80px 0px 0px 0px', threshold: 0
  }).observe(heroGrid);
}

// ---------- Movimento (taste-gsap) ----------
// Tudo que se move fica num gsap.context + matchMedia. Com movimento reduzido,
// sem GSAP ou sem JS, a página já está completa: os estados iniciais só
// existem aqui dentro.
const root = document.documentElement;
const ready = () => root.classList.add('motion-ready');

const dial = document.querySelector('.dial-inner');
const dialNum = document.querySelector('[data-dial-num]');
const dialName = document.querySelector('[data-dial-name]');
const dialFill = document.querySelector('[data-dial-fill]');
const phaseList = document.querySelector('.phase-list');
const phases = [...document.querySelectorAll('.phase[data-phase]')];

let currentPhase = null;
let swapTimer;
function setPhase(el) {
  if (!el || el === currentPhase || !dial || !dialNum || !dialName) return;
  currentPhase = el;
  phases.forEach(p => p.classList.toggle('is-active', p === el));
  const apply = () => { dialNum.textContent = el.dataset.phase; dialName.textContent = el.dataset.name; };
  if (reduceMotion.matches) { apply(); return; }
  clearTimeout(swapTimer);
  dial.classList.add('is-swapping');
  swapTimer = setTimeout(() => { apply(); dial.classList.remove('is-swapping'); }, 140);
}

// Palavras do princípio, para o "dissolve" no pin (só desktop, só com movimento).
const quote = document.querySelector('[data-dissolve]');
let quoteWords = [];
if (quote) {
  const wrapWords = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(document.createTextNode(part)); return; }
          const w = document.createElement('span');
          w.className = 'qw';
          w.textContent = part;
          quoteWords.push(w);
          frag.append(w);
        });
        child.replaceWith(frag);
      } else {
        wrapWords(child);
      }
    });
  };
  wrapWords(quote);
}

function startMotion() {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) {
    // Sem GSAP: página estática completa; o mostrador ainda acompanha a leitura.
    ready();
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-in'));
    if (hasIO && phases.length) {
      const po = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setPhase(e.target)),
        { rootMargin: '-45% 0px -45% 0px' });
      phases.forEach(p => po.observe(p));
    }
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  gsap.context(() => {
    // Mostrador: numeral por fase (vale também com movimento reduzido, é informação)
    phases.forEach(p => ScrollTrigger.create({
      trigger: p, start: 'top center', end: 'bottom center',
      onToggle: self => { if (self.isActive) setPhase(p); }
    }));

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', () => {
      ready();
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-in'));
      if (dialFill) gsap.set(dialFill, { scaleY: 1 });
    });

    mm.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 768px)'
    }, context => {
      const { desktop } = context.conditions;
      if (!context.conditions.motion) return;

      // --- Abertura: uma timeline, expo.out, abaixo de 1,4s ---
      const hero = document.querySelector('.hero');
      const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' }, onStart: ready });
      heroTl
        .from('.hero-kicker', { autoAlpha: 0, y: 12, duration: .8 }, 0)
        .from('.hero-title .line-in', { yPercent: 112, duration: 1.05, stagger: .11 }, .08)
        .from(['.hero-sub', '.hero-actions'], { opacity: 0, y: 16, duration: .9, stagger: .1 }, .42)
        .fromTo('.hero-photo .window-pane', { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'expo.inOut' }, .12)
        .from('.hero-photo img', { scale: 1.12, duration: 1.3 }, .12)
        .from(['.hero-photo figcaption', '.concept'], { autoAlpha: 0, duration: .6, ease: 'power2.out' }, .95);

      // --- Blocos: entram uma vez, em lote ---
      const blocks = gsap.utils.toArray('[data-reveal]');
      // opacity (não autoAlpha): o bloco continua focável pelo teclado antes de aparecer.
      gsap.set(blocks, { opacity: 0, y: desktop ? 18 : 12 });
      ScrollTrigger.batch(blocks, {
        start: 'top 86%', once: true,
        onEnter: batch => {
          batch.forEach(el => el.classList.add('is-in'));
          gsap.to(batch, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .08, overwrite: true });
        }
      });

      // --- Foto do escritório: abre ao entrar ---
      const office = document.querySelector('.office-window .window-pane');
      if (office) {
        gsap.fromTo(office, { clipPath: 'inset(7% 7% 7% 7%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: office, start: 'top 80%', once: true }
        });
      }

      // --- Progresso de leitura no cabeçalho ---
      const progress = document.querySelector('[data-progress]');
      if (progress) {
        gsap.to(progress, { scaleX: 1, ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
      }

      // --- Mostrador: linha preenchida pela leitura ---
      if (dialFill && phaseList) {
        gsap.fromTo(dialFill, { scaleY: 0 }, { scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: phaseList, start: 'top center', end: 'bottom center', scrub: .6 } });
      }

      if (!desktop) return;

      // --- Desktop: fotos deslizam dentro da moldura ---
      gsap.utils.toArray('.window-pane').forEach(pane => {
        pane.classList.add('has-drift');
        gsap.fromTo(pane.querySelector('img'), { yPercent: 0 }, {
          yPercent: -10, ease: 'none',
          scrollTrigger: {
            trigger: pane, scrub: .6, invalidateOnRefresh: true,
            start: pane.closest('.hero') ? 'top top' : 'top bottom', end: 'bottom top'
          }
        });
      });

      // --- Desktop: o princípio fica fixo e as palavras assentam (único pin da página) ---
      if (quote && quoteWords.length) {
        gsap.fromTo(quoteWords, { opacity: .14 }, {
          opacity: 1, ease: 'none', stagger: .12,
          scrollTrigger: {
            trigger: '.principle', start: 'center center', end: '+=140%',
            pin: true, pinSpacing: true, scrub: .6, invalidateOnRefresh: true
          }
        });
      }

      return () => document.querySelectorAll('.has-drift').forEach(p => p.classList.remove('has-drift'));
    });
  });

  // Fontes e imagens mudam as medidas: recalcula os gatilhos depois delas.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
startMotion();

// ---------- Pré-atendimento ----------
const TEXT = {
  fase: {
    fundar: 'a abertura de uma empresa ou sociedade',
    crescer: 'contratos, a entrada de sócios ou o crescimento da empresa',
    organizar: 'a organização do patrimônio da família e da empresa',
    suceder: 'sucessão e a passagem de bens para a próxima geração',
    resolver: 'um desacordo que já existe entre sócios, parceiros ou herdeiros'
  },
  prazo: {
    sem: 'Não há prazo definido.',
    semanas: 'Gostaria de conversar nas próximas semanas.',
    correndo: 'Há um prazo correndo.'
  },
  retorno: {
    whatsapp: 'Prefiro retorno pelo WhatsApp.',
    ligacao: 'Prefiro retorno por ligação.',
    email: 'Prefiro retorno por e-mail.'
  }
};

const form = document.querySelector('[data-intake]');
const letter = document.querySelector('.letter');
const note = document.querySelector('[data-letter-note]');
const sendBtn = document.querySelector('[data-send]');

function state() {
  const v = name => form?.querySelector(`input[name="${name}"]:checked`)?.value;
  const nome = (form?.querySelector('input[name="nome"]')?.value || '').trim().replace(/\s+/g, ' ');
  return { fase: v('fase') || 'fundar', prazo: v('prazo') || 'sem', retorno: v('retorno') || 'whatsapp', nome };
}

function buildMessage(s = state()) {
  const hello = s.nome ? `Olá, meu nome é ${s.nome}.` : 'Olá.';
  return `${hello} Gostaria de agendar uma conversa sobre ${TEXT.fase[s.fase]}. ${TEXT.prazo[s.prazo]} ${TEXT.retorno[s.retorno]}`;
}

function writeLetter() {
  const message = buildMessage();
  document.querySelectorAll('[data-letter]').forEach(el => { el.textContent = message; });
  if (note) note.hidden = state().prazo !== 'correndo';
}

let changeTimer;
function render(animate) {
  clearTimeout(changeTimer);
  if (!animate || !letter || reduceMotion.matches) { writeLetter(); return; }
  letter.classList.add('is-changing');
  // Vale sempre a última escolha: o texto é montado na hora da troca.
  changeTimer = setTimeout(() => { writeLetter(); letter.classList.remove('is-changing'); }, 140);
}

if (form) {
  form.addEventListener('change', e => { if (e.target.name !== 'nome') render(true); });
  form.addEventListener('input', e => { if (e.target.name === 'nome') render(false); });
  form.addEventListener('submit', e => e.preventDefault());
  render(false);
}

// ---------- Envio (real ou demonstração) ----------
const dialog = document.querySelector('[data-dialog]');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const s = state();
    const message = buildMessage(s);
    if (s.retorno === 'email' && CONTACT_EMAIL) {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Agendar uma conversa')}&body=${encodeURIComponent(message)}`;
      return;
    }
    if (s.retorno !== 'email' && WHATSAPP_NUMBER) {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
      return;
    }
    writeLetter();
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  });
}
if (dialog) {
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  if (typeof dialog.showModal !== 'function') {
    dialog.querySelectorAll('[value="close"]').forEach(b => b.addEventListener('click', e => {
      e.preventDefault(); dialog.removeAttribute('open'); sendBtn?.focus();
    }));
  }
}

const copyBtn = document.querySelector('[data-copy]');
if (copyBtn) {
  let copyTimer;
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(buildMessage());
      copyBtn.textContent = 'Mensagem copiada';
    } catch {
      copyBtn.textContent = 'Selecione o texto para copiar';
    }
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copyBtn.textContent = 'Copiar mensagem'; }, 2000);
  });
}
