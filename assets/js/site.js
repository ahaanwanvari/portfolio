const modals = document.querySelectorAll('.modal');
let previousFocus = null;

function openModal(name) {
  const modal = document.getElementById(`${name}-modal`);
  if (!modal) return;
  previousFocus = document.activeElement;
  const iframe = modal.querySelector('iframe');
  if (iframe && !iframe.getAttribute('src')) iframe.src = iframe.dataset.src;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close')?.focus();
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  modal.querySelector('iframe')?.removeAttribute('src');
  document.body.style.overflow = '';
  previousFocus?.focus();
  previousFocus = null;
}

document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.open)));
document.querySelectorAll('.modal-close').forEach(button => button.addEventListener('click', () => closeModal(button.closest('.modal'))));
modals.forEach(modal => modal.addEventListener('click', event => { if (event.target === modal) closeModal(modal); }));
document.addEventListener('keydown', event => {
  const modal = document.querySelector('.modal.active');
  if (!modal) return;
  if (event.key === 'Escape') closeModal(modal);
  if (event.key === 'Tab') {
    const items = [...modal.querySelectorAll('button, iframe, a[href]')];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

const mobileMenu = document.querySelector('.mobile-header details');
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { mobileMenu.open = false; }));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.side-nav a[href^="#"]')];
const breadcrumb = document.querySelector('.topbar > span');
if (sections.length && navLinks.length) {
  const updateLocation = () => {
    const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= 125) || sections[0];
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${current.id}`) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (breadcrumb) breadcrumb.innerHTML = `PORTFOLIO <span class="slash">/</span> ${current.id === 'lab' ? 'HOMELAB' : current.id === 'work' ? 'PROJECTS' : current.id.toUpperCase()}`;
  };
  window.addEventListener('scroll', updateLocation, { passive: true });
  updateLocation();
}

const hash = location.hash.slice(1);
if (hash && document.getElementById(`${hash}-modal`)) document.getElementById(hash)?.scrollIntoView();
