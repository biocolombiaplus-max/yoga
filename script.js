/* =========================================================
   Shanti · Yoga & Retiros — Interacciones
   ========================================================= */

// ====== CONFIGURACIÓN (edita aquí) ======
const CONFIG = {
  whatsapp: '573000000000',          // Número con indicativo, sin "+"
  formEndpoint: '',                   // URL para recibir inscripciones (Formspree, Make, Zapier, Google Apps Script…). Vacío = modo demo
  waMessage: 'Hola 🌿 Quiero información sobre las clases y retiros de Shanti.'
};

// Horario semanal (0 = lunes)
const SCHEDULE = [
  [ { t: '06:30', n: 'Vinyasa al amanecer', d: 'Activa · 60 min', m: 'studio' }, { t: '12:30', n: 'Pausa consciente', d: 'Suave · 45 min', m: 'online' }, { t: '19:00', n: 'Hatha Yoga', d: 'Todos los niveles · 75 min', m: 'studio' } ],
  [ { t: '07:00', n: 'Hatha para principiantes', d: 'Suave · 60 min', m: 'online' }, { t: '18:00', n: 'Yoga Prenatal', d: 'Suave · 60 min', m: 'studio' }, { t: '19:30', n: 'Vinyasa Flow', d: 'Activa · 75 min', m: 'studio' } ],
  [ { t: '06:30', n: 'Vinyasa al amanecer', d: 'Activa · 60 min', m: 'studio' }, { t: '19:00', n: 'Yin Yoga & Meditación', d: 'Suave · 75 min', m: 'online' } ],
  [ { t: '07:00', n: 'Yoga para la espalda', d: 'Terapéutico · 60 min', m: 'studio' }, { t: '12:30', n: 'Pausa consciente', d: 'Suave · 45 min', m: 'online' }, { t: '19:30', n: 'Vinyasa Flow', d: 'Activa · 75 min', m: 'studio' } ],
  [ { t: '07:00', n: 'Hatha Yoga', d: 'Todos los niveles · 60 min', m: 'online' }, { t: '18:30', n: 'Restaurativo', d: 'Muy suave · 75 min', m: 'studio' } ],
  [ { t: '08:00', n: 'Vinyasa largo', d: 'Activa · 90 min', m: 'studio' }, { t: '10:00', n: 'Meditación guiada', d: 'Todas · 45 min', m: 'online' } ],
  [ { t: '09:00', n: 'Yin Yoga dominical', d: 'Suave · 75 min', m: 'studio' } ]
];

document.documentElement.classList.remove('no-js');
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const waLink = (msg = CONFIG.waMessage) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

// ---------- Nav ----------
const nav = $('#nav');
const mobileCta = $('#mobileCta');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  const signup = $('#inscripcion').getBoundingClientRect();
  const inSignup = signup.top < window.innerHeight && signup.bottom > 0;
  mobileCta.classList.toggle('show', window.scrollY > 600 && !inSignup);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const toggle = $('#navToggle');
const links = $('#navLinks');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', open);
  links.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
$$('a', links).forEach(a => a.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  links.classList.remove('open');
  document.body.style.overflow = '';
}));

// ---------- Reveal ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
$$('.reveal').forEach(el => io.observe(el));

// ---------- Contadores ----------
const countIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 1800;
    const step = now => {
      const p = Math.min((now - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString('es-CO') + (p === 1 ? suf : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countIO.unobserve(el);
  });
}, { threshold: .5 });
$$('[data-count]').forEach(el => countIO.observe(el));

// ---------- Respiración guiada (4 in · 4 hold · 6 out) ----------
const breath = $('#breath'), bLabel = $('#breathLabel'), bSub = $('#breathSub');
let breathTimer = null;
breath.addEventListener('click', () => {
  if (breathTimer) {
    clearTimeout(breathTimer); breathTimer = null;
    breath.classList.remove('active');
    bLabel.textContent = 'Respira con nosotros'; bSub.textContent = 'Toca el círculo · 1 minuto';
    return;
  }
  const phases = [['Inhala…', 4000], ['Sostén…', 4000], ['Exhala lento…', 6000]];
  let i = 0, cycles = 0;
  breath.classList.remove('active'); void breath.offsetWidth; breath.classList.add('active');
  const run = () => {
    if (cycles >= 4) {
      breath.classList.remove('active'); breathTimer = null;
      bLabel.textContent = 'Así se siente la calma'; bSub.textContent = 'Imagina una clase completa 🌿';
      return;
    }
    const [txt, ms] = phases[i];
    bLabel.textContent = txt; bSub.textContent = `Ciclo ${cycles + 1} de 4`;
    i = (i + 1) % 3; if (i === 0) cycles++;
    breathTimer = setTimeout(run, ms);
  };
  run();
});

// ---------- Horarios ----------
const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const daysEl = $('#days'), listEl = $('#classesList');
let curDay = (new Date().getDay() + 6) % 7, curMode = 'all';
const today = new Date();
const monday = new Date(today); monday.setDate(today.getDate() - curDay);

dayNames.forEach((n, i) => {
  const d = new Date(monday); d.setDate(monday.getDate() + i);
  const b = document.createElement('button');
  b.type = 'button'; b.setAttribute('role', 'tab');
  b.innerHTML = `<small>${n}</small><strong>${d.getDate()}</strong>`;
  b.addEventListener('click', () => { curDay = i; renderSchedule(); });
  daysEl.appendChild(b);
});

function renderSchedule() {
  $$('button', daysEl).forEach((b, i) => { b.classList.toggle('active', i === curDay); b.setAttribute('aria-selected', i === curDay); });
  const items = SCHEDULE[curDay].filter(c => curMode === 'all' || c.m === curMode);
  listEl.innerHTML = items.length ? items.map(c => `
    <div class="class-row">
      <time>${c.t}</time>
      <div><h4>${c.n}</h4><p>${c.d} · con Valentina</p></div>
      <span class="class-mode ${c.m}">${c.m === 'online' ? 'Online en vivo' : 'Presencial'}</span>
      <a href="#inscripcion" class="btn btn-ghost btn-sm" data-interest="Clases" data-program="${c.n} · ${dayNames[curDay]} ${c.t}">Reservar</a>
    </div>`).join('') : `<p class="empty">No hay clases ${curMode === 'online' ? 'online' : 'presenciales'} este día. Prueba con otro 🌿</p>`;
}
$$('.toggle button').forEach(b => b.addEventListener('click', () => {
  $$('.toggle button').forEach(x => { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
  b.classList.add('active'); b.setAttribute('aria-selected', 'true');
  curMode = b.dataset.mode; renderSchedule();
}));
renderSchedule();

// ---------- Cuenta regresiva ----------
const cd = $('#countdown');
const target = new Date(cd.dataset.date).getTime();
const pad = n => String(n).padStart(2, '0');
const tick = () => {
  let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
  const d = Math.floor(s / 86400); s %= 86400;
  const h = Math.floor(s / 3600); s %= 3600;
  const m = Math.floor(s / 60); s %= 60;
  $('[data-cd="d"]', cd).textContent = pad(d);
  $('[data-cd="h"]', cd).textContent = pad(h);
  $('[data-cd="m"]', cd).textContent = pad(m);
  $('[data-cd="s"]', cd).textContent = pad(s);
};
tick(); setInterval(tick, 1000);

// ---------- WhatsApp ----------
$$('.js-whatsapp').forEach(a => { a.href = waLink(); a.target = '_blank'; a.rel = 'noopener'; });

// ---------- Privacidad ----------
const modal = $('#privacyModal');
$$('.js-privacy').forEach(a => a.addEventListener('click', e => { e.preventDefault(); modal.showModal(); }));

// ---------- Formulario multi-paso ----------
const form = $('#signupForm');
const panels = $$('.step-panel', form);
const bar = $('#progressBar'), stepLabel = $('#stepLabel');
const labels = ['¿Qué te interesa?', 'Sobre tu práctica', 'Tus datos'];
let step = 1;

function showStep(n) {
  step = n;
  panels.forEach(p => p.classList.toggle('active', +p.dataset.step === n));
  bar.style.width = `${(n / 3) * 100}%`;
  stepLabel.textContent = `Paso ${n} de 3 · ${labels[n - 1]}`;
}

// Prellenar desde botones con data-interest / data-program
document.addEventListener('click', e => {
  const a = e.target.closest('[data-interest]');
  if (!a) return;
  const r = form.querySelector(`input[name="interes"][value="${a.dataset.interest}"]`);
  if (r) r.checked = true;
  if (a.dataset.program) form.programa.value = a.dataset.program;
  else if (a.dataset.interest === 'Retiro') form.programa.value = 'Retiro Raíces · 12–15 marzo';
  if (!$('#success').hidden) return;
  showStep(1);
});

// UTM / fbclid desde la URL del anuncio
const params = new URLSearchParams(location.search);
['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'fbclid'].forEach(k => { if (params.get(k)) form[k].value = params.get(k); });

function validate(n) {
  const err = $(`[data-error="${n}"]`, form);
  err.textContent = '';
  if (n === 1 && !form.querySelector('input[name="interes"]:checked')) { err.textContent = 'Elige una opción para continuar 🌿'; return false; }
  if (n === 2 && !form.querySelector('input[name="nivel"]:checked')) { err.textContent = 'Cuéntanos tu experiencia para recomendarte la clase ideal.'; return false; }
  if (n === 3) {
    let ok = true;
    const nombre = form.nombre, wa = form.whatsapp, email = form.email;
    [nombre, wa, email].forEach(i => i.classList.remove('invalid'));
    if (nombre.value.trim().length < 3) { nombre.classList.add('invalid'); ok = false; }
    if (wa.value.replace(/\D/g, '').length < 7) { wa.classList.add('invalid'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { email.classList.add('invalid'); ok = false; }
    if (!ok) { err.textContent = 'Revisa los campos marcados, por favor.'; return false; }
    if (!form.consentimiento.checked) { err.textContent = 'Necesitamos tu autorización para contactarte.'; return false; }
  }
  return true;
}

$$('[data-next]', form).forEach(b => b.addEventListener('click', () => { if (validate(step)) showStep(step + 1); }));
$$('[data-prev]', form).forEach(b => b.addEventListener('click', () => showStep(step - 1)));
$$('input[name="interes"]', form).forEach(r => r.addEventListener('change', () => setTimeout(() => validate(1) && showStep(2), 250)));

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validate(3)) return;
  if (form.website.value) return; // bot

  const fd = new FormData(form);
  const data = Object.fromEntries(fd.entries());
  data.objetivos = fd.getAll('objetivos').join(', ');
  data.fecha = new Date().toISOString();
  delete data.website;

  const btn = $('#submitBtn');
  btn.classList.add('loading'); btn.textContent = 'Enviando';

  try {
    if (CONFIG.formEndpoint) {
      await fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
    } else {
      await new Promise(r => setTimeout(r, 900)); // modo demo
      try { const leads = JSON.parse(localStorage.getItem('shanti_leads') || '[]'); leads.push(data); localStorage.setItem('shanti_leads', JSON.stringify(leads)); } catch (_) {}
    }
    if (window.fbq) fbq('track', 'Lead', { content_name: data.interes });
  } catch (_) { /* aun así mostramos éxito y ofrecemos WhatsApp */ }

  const first = data.nombre.trim().split(' ')[0];
  $('#successName').textContent = first;
  $('#successWa').href = waLink(`Hola 🌿 soy ${data.nombre}. Acabo de inscribirme en la web y me interesa: ${data.interes}${data.programa ? ' – ' + data.programa : ''}.`);
  form.hidden = true;
  $('.form-progress').hidden = true; stepLabel.hidden = true;
  $('#success').hidden = false;
});

// ---------- Newsletter ----------
$('#newsletter').addEventListener('submit', e => {
  e.preventDefault();
  e.target.innerHTML = '<p style="margin:12px 0;color:var(--gold)">¡Gracias! Pronto recibirás calma en tu correo 🌿</p>';
});

$('#year').textContent = new Date().getFullYear();
