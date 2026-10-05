const modals = document.querySelectorAll('.modal');
function openModal(name) {
  const modal = document.getElementById(`${name}-modal`);
  if (!modal) return;
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
  const iframe = modal.querySelector('iframe');
  if (iframe) iframe.removeAttribute('src');
  document.body.style.overflow = '';
  document.querySelector(`[data-open="${modal.id.replace('-modal','')}"]`)?.focus();
}
document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.open)));
document.querySelectorAll('.modal-close').forEach(button => button.addEventListener('click', () => closeModal(button.closest('.modal'))));
modals.forEach(modal => modal.addEventListener('click', event => { if (event.target === modal) closeModal(modal); }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') document.querySelectorAll('.modal.active').forEach(closeModal); });
const hash = location.hash.slice(1);
if (hash && document.getElementById(`${hash}-modal`)) {
  document.getElementById(hash)?.scrollIntoView();
}
