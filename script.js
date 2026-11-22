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
const hero = document.querySelector('.hero');
if (topBar && hero && hasIO) {
  new IntersectionObserver(([e]) => topBar.classList.toggle('is-stuck', !e.isIntersecting), {
    rootMargin: '-80px 0px 0px 0px', threshold: 0
  }).observe(document.querySelector('.hero-grid') || hero);
}

// ---------- Abertura ----------
// O título é dividido em palavras, cada uma dentro da própria máscara.
// O atraso fica no próprio elemento que se move.
const title = document.querySelector('[data-split]');
if (title) {
  title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
  let n = 0;
  const wrap = word => {
    const w = document.createElement('span');
    w.className = 'w';
    w.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.textContent = word;
    inner.style.transitionDelay = `${120 + n++ * 45}ms`;
    w.append(inner);
    return w;
  };
  const splitInto = (source, target) => {
    [...source.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          target.append(/^\s+$/.test(part) ? document.createTextNode(' ') : wrap(part));
        });
      } else {
        const clone = node.cloneNode(false);
        splitInto(node, clone);
        target.append(clone);
      }
    });
  };
  const frag = document.createDocumentFragment();
  splitInto(title, frag);
  title.replaceChildren(frag);
}
if (hero) {
  // Espera as fontes (até 700ms) para que a máscara não corte a palavra errada.
  const start = () => requestAnimationFrame(() => hero.classList.add('is-in'));
  const fonts = document.fonts?.ready ?? Promise.resolve();
  Promise.race([fonts, new Promise(r => setTimeout(r, 700))]).then(start);
}

// ---------- Revelação de blocos ----------
// Cada bloco entra uma vez. Os que entram no mesmo instante são escalonados em 80ms.
const revealEls = document.querySelectorAll('[data-reveal], .office-window');
const reveal = (el, delay) => {
  if (delay) {
    el.style.transitionDelay = `${delay}ms`;
    el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
  }
  el.classList.add('is-in');
};
if (hasIO) {
  const io = new IntersectionObserver(entries => {
    let i = 0;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target, Math.min(i++, 4) * 80);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-in'));
}

// ---------- Mostrador das fases ----------
const dial = document.querySelector('.dial-inner');
const dialNum = document.querySelector('[data-dial-num]');
const dialName = document.querySelector('[data-dial-name]');
const dialFill = document.querySelector('[data-dial-fill]');
const phaseList = document.querySelector('.phase-list');
const phases = [...document.querySelectorAll('.phase[data-phase]')];

if (dial && dialNum && dialName && dialFill && phaseList && phases.length && hasIO) {
  let current = null;
  let swapTimer;
  const setPhase = el => {
    if (el === current) return;
    current = el;
    phases.forEach(p => p.classList.toggle('is-active', p === el));
    const apply = () => { dialNum.textContent = el.dataset.phase; dialName.textContent = el.dataset.name; };
    if (reduceMotion.matches) { apply(); return; }
    clearTimeout(swapTimer);
    dial.classList.add('is-swapping');
    swapTimer = setTimeout(() => { apply(); dial.classList.remove('is-swapping'); }, 140);
  };
  const po = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setPhase(e.target); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  phases.forEach(p => po.observe(p));

  // Progresso: a linha do mostrador acompanha a leitura das cinco fases.
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = phaseList.getBoundingClientRect();
    const mid = window.innerHeight / 2;
    const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
    dialFill.style.transform = `scaleY(${p.toFixed(4)})`;
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { window.addEventListener('scroll', onScroll, { passive: true }); update(); }
    else window.removeEventListener('scroll', onScroll);
  }).observe(phaseList);
}

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
