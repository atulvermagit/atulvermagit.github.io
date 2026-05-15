// ===== CUSTOM CURSOR =====
const cursorOuter = document.getElementById('cursor-outer');
const cursorInner = document.getElementById('cursor-inner');
let mouseX = 0, mouseY = 0, outerX = 0, outerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorInner.style.left = mouseX + 'px';
  cursorInner.style.top = mouseY + 'px';
});

function animateCursor() {
  outerX += (mouseX - outerX) * 0.12;
  outerY += (mouseY - outerY) * 0.12;
  cursorOuter.style.left = outerX + 'px';
  cursorOuter.style.top = outerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .highlight-card, .system-card, .edu-card, .skill-tags span, #chatbot-bubble').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ===== PARTICLES =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.5 ? '0,245,255' : '124,58,237'
  };
}

for (let i = 0; i < 120; i++) particles.push(createParticle());

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
    ctx.fill();
  });
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,245,255,${0.06 * (1 - dist/100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ===== TYPEWRITER =====
const phrases = [
  'ML Engineer @ Telus International',
  'LLM Systems Architect',
  'NLP & Multimodal Researcher',
  'Hackathon Winner 🏆',
  'Published IEEE & EMNLP Author'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typewrite() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typeEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { deleting = true; setTimeout(typewrite, 1800); return; }
  } else {
    typeEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(typewrite, deleting ? 50 : 80);
}
typewrite();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV TOGGLE =====
document.querySelector('.nav-toggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
});

// ===== AOS (manual scroll animations) =====
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.aosDelay || 0;
        setTimeout(() => e.target.classList.add('aos-animate'), parseInt(delay));
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}
initAOS();

// ===== COUNTERS =====
function animateCounters() {
  document.querySelectorAll('.count').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = target >= 1000000
        ? (current / 1000000).toFixed(1) + 'M'
        : Math.floor(current).toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 16);
  });
  document.querySelectorAll('.count-decimal').forEach(el => {
    el.textContent = parseFloat(el.dataset.target).toFixed(5);
  });
}

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounters(); heroObserver.disconnect(); } });
}, { threshold: 0.3 });
heroObserver.observe(document.getElementById('hero'));

// ===== CHATBOT =====
const botKnowledge = {
  greetings: ['hi','hello','hey','howdy','sup','greetings'],
  skills: ['skill','tech','language','framework','tools','know','expertise','stack'],
  experience: ['experience','work','job','telus','company','career','employed'],
  projects: ['project','system','built','resume','interviewer','platform','annotation'],
  education: ['education','degree','iit','bit','phd','mtech','btech','study','college','university'],
  publications: ['paper','publication','ieee','emnlp','research','published','journal'],
  contact: ['contact','email','phone','reach','connect','message','mobile'],
  highlights: ['highlight','achievement','award','hackathon','winner','impressive','accomplishment'],
  cost: ['cost','price','cheap','efficient','optimization','latency','speed','fast'],
  llm: ['llm','gpt','claude','llama','mistral','mixtral','language model','ai','chatgpt'],
  about: ['who','atul','about','tell me','introduce','yourself']
};

const botResponses = {
  greetings: () => `👋 Hey there! I'm Atul's AI assistant. I can tell you all about his experience, skills, projects, research papers, and more! What would you like to know? 🚀`,
  about: () => `🤖 Atul Verma is a **Software Development ML Engineer** at Telus International. He builds large-scale LLM/NLP systems, has published research at IEEE & EMNLP, and won the Telus internal AI Hackathon. He's currently based in India. Want to know more about his work or skills?`,
  skills: () => `💡 Atul's core skills include:\n• **Languages**: Python, C++, JavaScript\n• **ML/DL**: PyTorch, TensorFlow, XGBoost, LoRA/PEFT\n• **LLMs**: LLaMA, GPT-4, Claude, Mistral, Mixtral\n• **NLP**: HuggingFace, LangChain, RAG, Prompt Engineering\n• **Cloud**: AWS, Docker, Kubernetes, RabbitMQ, Grafana`,
  experience: () => `💼 Atul has been working at **Telus International** since Feb 2024 as an ML Engineer. He builds LLM-powered systems for resume parsing and AI-driven interviews. He processed **5.8M resumes** at just $0.00015 each and won the internal AI Hackathon!`,
  projects: () => `🔧 Atul built 3 major systems:\n1. **Resume Intelligence Platform** – Processes 5.8M+ resumes with 4-7s latency\n2. **AI Interviewer System** – LLM-driven interviews at $0.20/interview\n3. **Annotation Quality Framework** – IRR-based evaluation using Krippendorff's Alpha`,
  education: () => `🎓 Atul's academic journey:\n• **M.Tech** in Math & Computing from **IIT Patna** – CGPA 8.82/10\n• **B.E.** in CS from **BIT Mesra** – CGPA 6.28/10\n• **Ph.D.** at IIT Patna (Discontinued) – CGPA 9.0/10`,
  publications: () => `📄 Atul has 2 research publications:\n1. **IEEE Transactions on Computational Social Systems** – Multimodal multi-task offensive analysis in code-mixed text (Hinglish)\n2. **EMNLP 2023** – Distress identification and cause extraction from multimodal posts (DCaM Corpus, 20K+ posts)`,
  contact: () => `📬 You can reach Atul at:\n• **Email**: atul.verma.a3@gmail.com\n• **Mobile**: +91 62047 74723\n• **Website**: atulvermagit.github.io`,
  highlights: () => `🏆 Key highlights:\n• Processed **5.8M resumes** at $0.00015 each\n• **Won** the Telus Internal AI Hackathon\n• Published in **IEEE** and **EMNLP**\n• Total infra cost for 5.8M resumes: only **$6,400**!`,
  cost: () => `💰 Atul is a master of cost optimization:\n• Resume parsing: **$0.00015/resume** (5.8M resumes = $6,400 total!)\n• AI Interviews: **$0.20/interview**\n• Latency: **4-7 seconds** end-to-end\nAchieved via batching, prompt compression & fallback strategies.`,
  llm: () => `🤖 Atul works extensively with LLMs including **LLaMA, Mixtral, Mistral, GPT-4, and Claude**. He specializes in prompt engineering, RAG pipelines, LoRA fine-tuning, and cost-optimized inference orchestration.`,
  default: () => `🤔 That's a great question! I can tell you about Atul's **skills**, **work experience**, **projects**, **research papers**, **education**, or **contact info**. Just ask! 😊`
};

const suggestions = [
  'Tell me about Atul',
  'What are his skills?',
  'Projects he built',
  'Research papers',
  'Education background',
  'Contact info'
];

const bubble = document.getElementById('chatbot-bubble');
const chatWindow = document.getElementById('chatbot-window');
const closeBtn = document.getElementById('chatbot-close');
const messagesEl = document.getElementById('chatbot-messages');
const inputEl = document.getElementById('chatbot-input');
const sendBtn = document.getElementById('chatbot-send');
const suggestionsEl = document.getElementById('chatbot-suggestions');

let chatOpened = false;

function toggleChat() {
  chatWindow.classList.toggle('hidden');
  if (!chatOpened) {
    chatOpened = true;
    setTimeout(() => addBotMessage(botResponses.greetings()), 400);
    renderSuggestions();
  }
}

bubble.addEventListener('click', toggleChat);
closeBtn.addEventListener('click', () => chatWindow.classList.add('hidden'));

function addBotMessage(text) {
  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  messagesEl.appendChild(typing);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  setTimeout(() => {
    typing.remove();
    const msg = document.createElement('div');
    msg.className = 'chat-msg bot';
    msg.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }, 900);
}

function addUserMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'chat-msg user';
  msg.textContent = text;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function processInput(text) {
  const lower = text.toLowerCase();
  addUserMessage(text);
  suggestionsEl.innerHTML = '';
  let response = null;
  for (const [key, keywords] of Object.entries(botKnowledge)) {
    if (keywords.some(kw => lower.includes(kw))) {
      response = botResponses[key] ? botResponses[key]() : null;
      break;
    }
  }
  addBotMessage(response || botResponses.default());
}

function renderSuggestions() {
  suggestionsEl.innerHTML = '';
  suggestions.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'chat-suggestion';
    btn.textContent = s;
    btn.addEventListener('click', () => { processInput(s); });
    suggestionsEl.appendChild(btn);
  });
}

sendBtn.addEventListener('click', () => {
  const val = inputEl.value.trim();
  if (val) { processInput(val); inputEl.value = ''; }
});
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') { const val = inputEl.value.trim(); if (val) { processInput(val); inputEl.value = ''; } }
});

// ===== 3D CARD TILT =====
function initTilt() {
  const tiltCards = document.querySelectorAll('.highlight-card, .system-card, .pub-card, .edu-card, .contact-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -10;
      const rotateY = ((x - cx) / cx) * 10;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
      // Neon glare
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(0,245,255,0.06), transparent 60%), var(--card, #0f1623)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.background = '';
    });
  });
}
initTilt();

// ===== SHOOTING STARS =====
function spawnShootingStar() {
  const star = document.createElement('div');
  star.style.cssText = `
    position:fixed; pointer-events:none; z-index:0;
    width:${Math.random()*120+60}px; height:2px;
    background:linear-gradient(90deg,rgba(0,245,255,0.9),transparent);
    border-radius:2px;
    top:${Math.random()*60}vh;
    left:${Math.random()*60+(-20)}vw;
    transform:rotate(${Math.random()*20-10+35}deg);
    opacity:0;
    animation:shoot 0.8s ease forwards;
  `;
  document.body.appendChild(star);
  const style = document.createElement('style');
  style.textContent = `@keyframes shoot{0%{opacity:0;transform:translate(0,0) rotate(35deg)}30%{opacity:1}100%{opacity:0;transform:translate(300px,150px) rotate(35deg)}}`;
  document.head.appendChild(style);
  setTimeout(() => { star.remove(); }, 900);
}
setInterval(() => { if (Math.random() > 0.4) spawnShootingStar(); }, 2500);

// ===== GLITCH EFFECT ON HERO NAME =====
const heroH1 = document.querySelector('#hero h1');
if (heroH1) {
  setInterval(() => {
    heroH1.style.textShadow = `${Math.random()*4-2}px 0 #00f5ff, ${Math.random()*-4+2}px 0 #7c3aed`;
    setTimeout(() => { heroH1.style.textShadow = ''; }, 80);
    setTimeout(() => {
      heroH1.style.textShadow = `${Math.random()*6-3}px 0 rgba(0,245,255,0.7), ${Math.random()*-6+3}px 0 rgba(124,58,237,0.7)`;
      setTimeout(() => { heroH1.style.textShadow = ''; }, 60);
    }, 120);
  }, 4000);
}

// ===== ACTIVE NAV ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}, { passive: true });


