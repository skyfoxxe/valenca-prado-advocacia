const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const open = item.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
});

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}


// ------------------------------------------------------------
// Experiência estratégica: navegação por necessidade + WhatsApp contextual
// ------------------------------------------------------------
const decisionData = {
  topics: {
    empresa: {
      label: 'Empresa', practice: 'Direito Empresarial',
      first: 'Contexto, riscos e objetivos',
      base: 'Questões empresariais podem envolver estrutura, responsabilidades, relações entre sócios e decisões que afetam a operação e a continuidade do negócio.',
      titles: {
        prevenir: 'Estruturar antes de assumir novos riscos.',
        decidir: 'Dar contexto jurídico a uma decisão empresarial.',
        reorganizar: 'Rever a estrutura sem perder de vista a operação.',
        resolver: 'Organizar a estratégia quando o conflito já existe.'
      }
    },
    contratos: {
      label: 'Contratos', practice: 'Societário e Contratos',
      first: 'Relações, obrigações e impactos futuros',
      base: 'Contratos relevantes pedem leitura do negócio, das obrigações assumidas e das consequências que podem surgir durante a relação entre as partes.',
      titles: {
        prevenir: 'Construir o contrato antes que a relação gere ruído.',
        decidir: 'Avaliar o que uma assinatura realmente coloca em jogo.',
        reorganizar: 'Revisar relações contratuais que deixaram de refletir a realidade.',
        resolver: 'Mapear alternativas quando a relação contratual entrou em tensão.'
      }
    },
    patrimonio: {
      label: 'Patrimônio', practice: 'Planejamento Patrimonial e Sucessório',
      first: 'Ativos, pessoas e continuidade',
      base: 'Decisões patrimoniais e sucessórias exigem olhar conjunto para ativos, relações familiares ou empresariais e efeitos que se estendem no tempo.',
      titles: {
        prevenir: 'Organizar hoje o que precisa continuar amanhã.',
        decidir: 'Comparar caminhos antes de reorganizar patrimônio.',
        reorganizar: 'Construir uma estrutura patrimonial mais coerente com o momento atual.',
        resolver: 'Compreender o cenário quando interesses patrimoniais entram em conflito.'
      }
    },
    conflitos: {
      label: 'Conflitos', practice: 'Contencioso Estratégico',
      first: 'Risco, alternativas e consequências',
      base: 'Conflitos empresariais e patrimoniais pedem análise do risco, dos interesses envolvidos e dos efeitos de cada alternativa antes de definir a estratégia.',
      titles: {
        prevenir: 'Reconhecer sinais de conflito antes da ruptura.',
        decidir: 'Escolher uma estratégia com visão das consequências.',
        reorganizar: 'Reavaliar posições quando o cenário muda.',
        resolver: 'Tratar o conflito como uma decisão estratégica, não automática.'
      }
    }
  },
  moments: {
    prevenir: { label: 'Prevenção', phrase: 'Meu objetivo é prevenir problemas antes de tomar uma decisão.' },
    decidir: { label: 'Decisão', phrase: 'Estou diante de uma decisão relevante e gostaria de compreender melhor os aspectos jurídicos envolvidos.' },
    reorganizar: { label: 'Reorganização', phrase: 'Quero reorganizar uma situação existente e avaliar alternativas jurídicas.' },
    resolver: { label: 'Conflito existente', phrase: 'Já existe um conflito e gostaria de apresentar o contexto para uma avaliação inicial.' }
  }
};

let selectedTopic = 'empresa';
let selectedMoment = 'prevenir';

const builder = document.querySelector('[data-decision-builder]');
const resultCode = document.querySelector('[data-result-code]');
const resultTitle = document.querySelector('[data-result-title]');
const resultText = document.querySelector('[data-result-text]');
const resultPractice = document.querySelector('[data-result-practice]');
const resultFirst = document.querySelector('[data-result-first]');

function currentMessage() {
  const topic = decisionData.topics[selectedTopic];
  const moment = decisionData.moments[selectedMoment];
  return `Olá. Conheci a Valença & Prado pelo site. Minha questão está relacionada a ${topic.label.toLowerCase()}. ${moment.phrase}`;
}

function renderDecision() {
  const topic = decisionData.topics[selectedTopic];
  const moment = decisionData.moments[selectedMoment];
  const result = document.querySelector('.decision-result');

  const applyContent = () => {
    if (resultCode) resultCode.textContent = `${topic.label} · ${moment.label}`;
    if (resultTitle) resultTitle.textContent = topic.titles[selectedMoment];
    if (resultText) resultText.textContent = topic.base;
    if (resultPractice) resultPractice.textContent = topic.practice;
    if (resultFirst) resultFirst.textContent = topic.first;
    document.querySelectorAll('[data-wa-message]').forEach(el => el.textContent = currentMessage());
  };

  if (!reduced && result && result.dataset.ready === 'true') {
    result.classList.add('is-changing');
    window.setTimeout(() => {
      applyContent();
      result.classList.remove('is-changing');
      result.classList.add('is-settled');
      window.setTimeout(() => result.classList.remove('is-settled'), 650);
    }, 145);
  } else {
    applyContent();
    if (result) result.dataset.ready = 'true';
  }
}

if (builder) {
  builder.querySelectorAll('[data-topic]').forEach(button => {
    button.addEventListener('click', () => {
      selectedTopic = button.dataset.topic;
      builder.querySelectorAll('[data-topic]').forEach(b => b.classList.toggle('is-active', b === button));
      renderDecision();
    });
  });
  builder.querySelectorAll('[data-moment]').forEach(button => {
    button.addEventListener('click', () => {
      selectedMoment = button.dataset.moment;
      builder.querySelectorAll('[data-moment]').forEach(b => b.classList.toggle('is-active', b === button));
      renderDecision();
    });
  });
}

const waModal = document.querySelector('[data-wa-modal]');
let lastFocus = null;
function openWaDemo(trigger) {
  if (!waModal) return;
  lastFocus = trigger;
  renderDecision();
  waModal.hidden = false;
  document.body.style.overflow = 'hidden';
  const close = waModal.querySelector('[data-wa-close]');
  if (close) close.focus();
}
function closeWaDemo() {
  if (!waModal) return;
  waModal.hidden = true;
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}
document.querySelectorAll('[data-wa-demo]').forEach(btn => btn.addEventListener('click', () => openWaDemo(btn)));
document.querySelectorAll('[data-wa-close]').forEach(btn => btn.addEventListener('click', closeWaDemo));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && waModal && !waModal.hidden) closeWaDemo();
});
const copyButton = document.querySelector('[data-copy-message]');
if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const message = currentMessage();
    try {
      await navigator.clipboard.writeText(message);
      const original = copyButton.textContent;
      copyButton.textContent = 'Mensagem copiada ✓';
      setTimeout(() => copyButton.textContent = original, 1800);
    } catch {
      copyButton.textContent = 'Selecione e copie a mensagem';
    }
  });
}
renderDecision();

// ------------------------------------------------------------
// V3 Estratégico — microinterações discretas para desktop
// ------------------------------------------------------------
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Parallax sutil no hero. O estado inicial permanece idêntico.
const heroVisual = document.querySelector('.hero-visual');
if (!reduced && finePointer && heroVisual) {
  heroVisual.addEventListener('pointermove', event => {
    const rect = heroVisual.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    heroVisual.style.setProperty('--hero-x', `${(nx * 6).toFixed(2)}px`);
    heroVisual.style.setProperty('--hero-y', `${(ny * 5).toFixed(2)}px`);
    heroVisual.classList.add('is-parallax');
  });
  heroVisual.addEventListener('pointerleave', () => {
    heroVisual.style.setProperty('--hero-x', '0px');
    heroVisual.style.setProperty('--hero-y', '0px');
    heroVisual.classList.remove('is-parallax');
  });
}

// Tilt muito pequeno + ponto de luz em elementos interativos.
function attachSubtleTilt(element, maxTilt = 1.4, lift = 2) {
  if (reduced || !finePointer || !element) return;

  element.addEventListener('pointermove', event => {
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - y) * maxTilt * 2;
    element.style.setProperty('--card-x', `${(x * 100).toFixed(1)}%`);
    element.style.setProperty('--card-y', `${(y * 100).toFixed(1)}%`);
    element.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-${lift}px)`;
  });

  element.addEventListener('pointerleave', () => {
    element.style.transform = '';
    element.style.removeProperty('--card-x');
    element.style.removeProperty('--card-y');
  });
}

document.querySelectorAll('.decision-option').forEach(el => attachSubtleTilt(el, 1.6, 2));
document.querySelectorAll('.context-item, .value-item').forEach(el => attachSubtleTilt(el, 1.0, 1));

// Luz ambiente segue o cursor apenas dentro da seção estratégica.
const strategySection = document.querySelector('.strategy-section');
if (!reduced && finePointer && strategySection) {
  strategySection.addEventListener('pointerenter', () => strategySection.classList.add('has-pointer'));
  strategySection.addEventListener('pointerleave', () => strategySection.classList.remove('has-pointer'));
  strategySection.addEventListener('pointermove', event => {
    const rect = strategySection.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    strategySection.style.setProperty('--spot-x', `${x.toFixed(1)}%`);
    strategySection.style.setProperty('--spot-y', `${y.toFixed(1)}%`);
  });
}
