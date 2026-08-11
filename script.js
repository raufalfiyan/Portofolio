// ===== Hero performance chart =====
(function drawChart(){
  const points = [140,132,120,110,118,95,88,70,60,48,30,20]; // y values, lower = higher performance
  const w = 360, h = 160;
  const stepX = w / (points.length - 1);
  const coords = points.map((y, i) => `${i*stepX},${y}`);
  const line = document.getElementById('linePath');
  const area = document.getElementById('areaPath');
  if(!line || !area) return;
  line.setAttribute('points', coords.join(' '));
  const areaD = `M0,${h} L` + coords.join(' L') + ` L${w},${h} Z`;
  area.setAttribute('d', areaD);
})();

// ===== Count-up stats =====
function countUp(el){
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = prefix + value + suffix;
    if(progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ===== Scroll reveal (also triggers count-up once) =====
const revealEls = document.querySelectorAll('.reveal');
const statEls = document.querySelectorAll('.stat-num');
let statsTriggered = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');

      if(entry.target.classList.contains('stats') && !statsTriggered){
        statsTriggered = true;
        statEls.forEach(countUp);
      }
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// stats block itself needs observing for the count-up trigger
const statsBlock = document.querySelector('.stats');
if(statsBlock) observer.observe(statsBlock);

// ===== FAQ accordion =====
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

// ===== Contact form -> WhatsApp =====
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const business = (data.get('business') || '').toString().trim();
    const budget = (data.get('budget') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    let text = `Halo RID, saya ${name} ingin konsultasi soal advertising.\n\n`;
    text += `Email: ${email}\n`;
    if(business) text += `Business: ${business}\n`;
    if(budget) text += `Monthly Ad Budget: ${budget}\n`;
    if(message) text += `\nDetail: ${message}\n`;
    text += `\nBoleh dibantu jadwalkan sesi konsultasinya?`;

    const waUrl = `https://wa.me/6281221902065?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  });
}
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if(navToggle){
  navToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = '#12151B';
    navLinks.style.padding = '20px 32px';
    navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
    navLinks.style.gap = '16px';
  });
}

// Close mobile nav after clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if(window.innerWidth <= 640 && navLinks) navLinks.style.display = 'none';
  });
});