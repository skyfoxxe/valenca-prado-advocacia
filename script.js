// Valença & Prado — v5
// Para um escritório real, preencha (só dígitos, com DDI e DDD, ex.: '5565999999999')
// e o e-mail. Vazios = modo demonstração.
const WHATSAPP_NUMBER = '';
const CONTACT_EMAIL = '';

// ---------- Menu ----------
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
if (toggle && menu) {
  const label = toggle.querySelector('span');
  const setMenu = open => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (label) label.textContent = open ? 'Fechar' : 'Menu';
  };
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
}

// ---------- Revelação ----------
// Uma entrada por bloco. Irmãos que entram juntos ganham 60ms de atraso cada
// (no próprio elemento, nunca por variável no pai). Com movimento reduzido,
// o CSS remove o deslocamento e mantém só o fade.
const revealEls = document.querySelectorAll('.reveal, .rule-draw, .reveal-mask');
document.querySelectorAll('.reveal').forEach(el => {
  const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
  const i = siblings.indexOf(el);
  if (siblings.length > 1 && i > 0) el.style.transitionDelay = `${Math.min(i, 4) * 60}ms`;
});
// Títulos com máscara (clip-path) são observados pelo bloco pai: o próprio
// recorte os deixaria fora da interseção.
const show = el => {
  el.classList.add('is-visible');
  el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
};
if ('IntersectionObserver' in window) {
  const watchers = new Map();
  revealEls.forEach(el => {
    const target = el.classList.contains('reveal-mask') ? el.parentElement : el;
    if (!watchers.has(target)) watchers.set(target, []);
    watchers.get(target).push(el);
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      watchers.get(entry.target).forEach(show);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  watchers.forEach((_, target) => io.observe(target));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ---------- Pré-atendimento ----------
const DATA = {
  topics: {
    empresa: {
      label: 'Empresa', practice: 'Direito Empresarial', first: 'Contexto, riscos e objetivos',
      text: 'Questões empresariais podem envolver estrutura, responsabilidades, relações entre sócios e decisões que afetam a operação e a continuidade do negócio.',
      titles: {
        prevenir: 'Estruturar antes de assumir novos riscos.',
        decidir: 'Dar contexto jurídico a uma decisão empresarial.',
        reorganizar: 'Rever a estrutura sem perder de vista a operação.',
        resolver: 'Organizar a estratégia quando o conflito já existe.'
      }
    },
    contratos: {
      label: 'Contratos', practice: 'Societário e Contratos', first: 'Relações, obrigações e efeitos futuros',
      text: 'Contratos relevantes pedem leitura do negócio, das obrigações assumidas e das consequências que podem surgir ao longo da relação entre as partes.',
      titles: {
        prevenir: 'Construir o contrato antes que a relação gere ruído.',
        decidir: 'Avaliar o que uma assinatura coloca em jogo.',
        reorganizar: 'Revisar contratos que deixaram de refletir a realidade.',
        resolver: 'Mapear alternativas quando a relação contratual entrou em tensão.'
      }
    },
    patrimonio: {
      label: 'Patrimônio', practice: 'Patrimonial e Sucessório', first: 'Bens, pessoas e continuidade',
      text: 'Decisões patrimoniais e sucessórias exigem olhar conjunto para os bens, as relações familiares ou empresariais e os efeitos que se estendem no tempo.',
      titles: {
        prevenir: 'Organizar hoje o que precisa continuar amanhã.',
        decidir: 'Comparar caminhos antes de reorganizar o patrimônio.',
        reorganizar: 'Adequar a estrutura patrimonial ao momento atual.',
        resolver: 'Compreender o cenário quando interesses patrimoniais entram em conflito.'
      }
    },
    conflitos: {
      label: 'Conflitos', practice: 'Contencioso Estratégico', first: 'Riscos, alternativas e consequências',
      text: 'Conflitos empresariais e patrimoniais pedem análise do risco, dos interesses envolvidos e dos efeitos de cada alternativa antes de definir a estratégia.',
      titles: {
        prevenir: 'Reconhecer sinais de conflito antes da ruptura.',
        decidir: 'Escolher um caminho com visão das consequências.',
        reorganizar: 'Reavaliar posições quando o cenário muda.',
        resolver: 'Tratar o conflito como uma decisão, não como um reflexo.'
      }
    }
  },
  moments: {
    prevenir: { label: 'Prevenção', phrase: 'Meu objetivo é prevenir problemas antes de tomar uma decisão.' },
    decidir: { label: 'Decisão', phrase: 'Estou diante de uma decisão e gostaria de entender os aspectos jurídicos envolvidos.' },
    reorganizar: { label: 'Reorganização', phrase: 'Quero reorganizar uma situação existente e avaliar alternativas.' },
    resolver: { label: 'Conflito existente', phrase: 'Já existe um conflito e gostaria de apresentar o contexto para uma avaliação inicial.' }
  },
  replies: {
    whatsapp: { phrase: 'Prefiro retorno pelo WhatsApp.', button: 'Enviar pelo WhatsApp' },
    telefone: { phrase: 'Prefiro retorno por ligação.', button: 'Enviar pelo WhatsApp' },
    email: { phrase: 'Prefiro retorno por e-mail.', button: 'Enviar por e-mail' }
  }
};

const form = document.querySelector('[data-intake]');
const brief = document.querySelector('.brief');
const sendBtn = document.querySelector('[data-send]');

function state() {
  const v = name => form?.querySelector(`input[name="${name}"]:checked`)?.value;
  const nome = (form?.querySelector('input[name="nome"]')?.value || '').trim().replace(/\s+/g, ' ');
  return { topic: v('tema') || 'empresa', moment: v('momento') || 'prevenir', reply: v('retorno') || 'whatsapp', nome };
}

function buildMessage(s = state()) {
  const t = DATA.topics[s.topic];
  const greeting = s.nome ? `Olá, meu nome é ${s.nome}.` : 'Olá.';
  return `${greeting} Conheci a Valença & Prado pelo site. Minha questão está relacionada a ${t.label.toLowerCase()}. ${DATA.moments[s.moment].phrase} ${DATA.replies[s.reply].phrase}`;
}

function setOut(key, value) {
  document.querySelectorAll(`[data-out="${key}"]`).forEach(el => { el.textContent = value; });
}

function render(animate) {
  const s = state();
  const t = DATA.topics[s.topic];
  const apply = () => {
    setOut('code', `${t.label} · ${DATA.moments[s.moment].label}`);
    setOut('title', t.titles[s.moment]);
    setOut('text', t.text);
    setOut('practice', t.practice);
    setOut('first', t.first);
    setOut('message', buildMessage());
    if (sendBtn) sendBtn.textContent = DATA.replies[s.reply].button;
  };
  if (animate && brief) {
    brief.classList.add('is-changing');
    setTimeout(() => { apply(); brief.classList.remove('is-changing'); }, 160);
  } else {
    apply();
  }
}

if (form) {
  form.addEventListener('change', () => render(true));
  form.addEventListener('input', e => { if (e.target.name === 'nome') setOut('message', buildMessage()); });
  form.addEventListener('submit', e => e.preventDefault());
  render(false);
}

// ---------- Envio (real ou demonstração) ----------
const dialog = document.querySelector('[data-dialog]');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const s = state();
    const message = buildMessage(s);
    if (s.reply === 'email' && CONTACT_EMAIL) {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Pré-atendimento pelo site')}&body=${encodeURIComponent(message)}`;
      return;
    }
    if (s.reply !== 'email' && WHATSAPP_NUMBER) {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
      return;
    }
    setOut('message', message);
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  });
}
if (dialog) dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

const copyBtn = document.querySelector('[data-copy]');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(buildMessage());
      copyBtn.textContent = 'Mensagem copiada';
    } catch {
      copyBtn.textContent = 'Selecione o texto para copiar';
    }
    setTimeout(() => { copyBtn.textContent = 'Copiar mensagem'; }, 2000);
  });
}

// ---------- Atalho flutuante some onde já existe chamada visível ----------
const floatCta = document.querySelector('.float-cta');
const zones = document.querySelectorAll('.hero, #pre-atendimento, #contato, .site-footer');
if (floatCta && 'IntersectionObserver' in window) {
  const visible = new Set();
  const zo = new IntersectionObserver(entries => {
    entries.forEach(e => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    floatCta.classList.toggle('is-hidden', visible.size > 0);
  }, { threshold: 0.04 });
  zones.forEach(z => zo.observe(z));
}
