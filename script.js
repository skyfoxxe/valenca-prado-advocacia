// Valença & Prado — v4
// Para um escritório real: preencha com o número no formato internacional,
// só dígitos (ex.: '5565999999999'). Vazio = modo demonstração.
const WHATSAPP_NUMBER = '';

document.documentElement.classList.add('js');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Menu ----------
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (menuToggle && nav) {
  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
}

// ---------- Revelação suave ----------
const revealEls = document.querySelectorAll('.reveal');
if (!reduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ---------- Orientador: tema + momento ----------
const guideData = {
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
      label: 'Patrimônio', practice: 'Planejamento Patrimonial e Sucessório', first: 'Bens, pessoas e continuidade',
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
  }
};

const guide = document.querySelector('[data-guide]');
const result = document.querySelector('.guide-result');
const out = {
  code: document.querySelector('[data-result-code]'),
  title: document.querySelector('[data-result-title]'),
  text: document.querySelector('[data-result-text]'),
  practice: document.querySelector('[data-result-practice]'),
  first: document.querySelector('[data-result-first]')
};
Object.values(out).forEach(el => el && el.setAttribute('data-swap', ''));

const selected = () => ({
  topic: guide?.querySelector('input[name="tema"]:checked')?.value || 'empresa',
  moment: guide?.querySelector('input[name="momento"]:checked')?.value || 'prevenir'
});

function currentMessage() {
  const { topic, moment } = selected();
  const t = guideData.topics[topic];
  const m = guideData.moments[moment];
  return `Olá. Conheci a Valença & Prado pelo site. Minha questão está relacionada a ${t.label.toLowerCase()}. ${m.phrase}`;
}

function renderGuide(animate) {
  const { topic, moment } = selected();
  const t = guideData.topics[topic];
  const m = guideData.moments[moment];
  const apply = () => {
    out.code.textContent = `${t.label} · ${m.label}`;
    out.title.textContent = t.titles[moment];
    out.text.textContent = t.text;
    out.practice.textContent = t.practice;
    out.first.textContent = t.first;
  };
  if (animate && !reduced && result) {
    result.classList.add('is-changing');
    setTimeout(() => { apply(); result.classList.remove('is-changing'); }, 220);
  } else {
    apply();
  }
}

if (guide) {
  guide.addEventListener('change', () => renderGuide(true));
  renderGuide(false);
}

// ---------- WhatsApp contextual ----------
const dialog = document.querySelector('[data-wa-dialog]');
const msgEl = document.querySelector('[data-wa-message]');
const sendBtn = document.querySelector('[data-wa-send]');
const noteEl = document.querySelector('[data-wa-note]');

if (WHATSAPP_NUMBER && sendBtn) {
  sendBtn.textContent = 'Abrir no WhatsApp';
  if (noteEl) noteEl.textContent = 'O WhatsApp abre com esta mensagem. Você pode editá-la antes de enviar.';
}

document.querySelectorAll('[data-wa-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (msgEl) msgEl.textContent = currentMessage();
    if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
  });
});

if (dialog) {
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
}

if (sendBtn) {
  sendBtn.addEventListener('click', async () => {
    const message = currentMessage();
    if (WHATSAPP_NUMBER) {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
      return;
    }
    const original = 'Copiar mensagem';
    try {
      await navigator.clipboard.writeText(message);
      sendBtn.textContent = 'Mensagem copiada';
    } catch {
      sendBtn.textContent = 'Selecione o texto para copiar';
    }
    setTimeout(() => { sendBtn.textContent = original; }, 2000);
  });
}

// ---------- Atalho de contato some onde já há contato visível ----------
const floatBtn = document.querySelector('.contact-float');
const hideZones = document.querySelectorAll('.hero, #contato, .site-footer');
if (floatBtn && 'IntersectionObserver' in window) {
  const visible = new Set();
  const zo = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
    floatBtn.classList.toggle('is-hidden', visible.size > 0);
  }, { threshold: 0.05 });
  hideZones.forEach(z => zo.observe(z));
}
