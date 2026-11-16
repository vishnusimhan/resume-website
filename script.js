// Navigation: shadow on scroll, mobile menu, active link
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.querySelectorAll('a').forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));

// Scroll reveal (staggers siblings slightly)
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
    entry.target.style.transitionDelay = (siblings.indexOf(entry.target) * 90) + 'ms';
    entry.target.classList.add('in');
    obs.unobserve(entry.target);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Cursor glow: smooth follow, no trail, shade adapts to what is underneath
const cursor = document.getElementById('cursor');
if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;

  window.addEventListener('mousemove', e => {
    x = e.clientX; y = e.clientY;
    cursor.classList.add('visible');
  }, { passive: true });
  document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));

  (function loop() {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  })();

  // Find the first non-transparent background behind an element and measure its brightness
  function brightnessBehind(el) {
    while (el) {
      const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
      if (m && (m.length < 4 || parseFloat(m[3]) > 0.5)) {
        return (0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2]) / 255;
      }
      el = el.parentElement;
    }
    return 1;
  }

  document.addEventListener('mouseover', e => {
    cursor.classList.toggle('dark-bg', brightnessBehind(e.target) < 0.45);
    cursor.classList.toggle('big', !!e.target.closest('a, button, .card'));
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
