const body = document.body;
const setScrollLock = (lock) => { body.style.overflow = lock ? 'hidden' : ''; };

const trapFocus = (container, onClose) => {
  const focusables = container.querySelectorAll('a,button,input,[tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return () => {};
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const key = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  container.addEventListener('keydown', key);
  first.focus();
  return () => container.removeEventListener('keydown', key);
};

const closeAllLang = () => document.querySelectorAll('.lang-switcher').forEach((w) => w.classList.remove('open'));
document.querySelectorAll('.lang-pill').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const wrap = btn.closest('.lang-switcher');
    const open = wrap.classList.contains('open');
    closeAllLang();
    wrap.classList.toggle('open', !open);
    btn.setAttribute('aria-expanded', String(!open));
  });
});
document.addEventListener('click', closeAllLang);

const drawer = document.getElementById('mobileDrawer');
const burger = document.querySelector('.burger');
const drawerPanel = drawer?.querySelector('.drawer-panel');
let untrapDrawer = null;
const closeDrawer = () => {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  burger?.setAttribute('aria-expanded', 'false');
  setScrollLock(false);
  if (untrapDrawer) untrapDrawer();
};
if (burger && drawer && drawerPanel) {
  burger.addEventListener('click', () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    setScrollLock(true);
    untrapDrawer = trapFocus(drawerPanel, closeDrawer);
  });
  drawer.querySelector('.drawer-close')?.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });
  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer(); });
}

const faqItems = [...document.querySelectorAll('.faq-item')];
faqItems.forEach((item) => {
  item.addEventListener('click', () => {
    faqItems.forEach((x) => x.setAttribute('aria-expanded', 'false'));
    item.setAttribute('aria-expanded', 'true');
  });
});

const privacyModal = document.getElementById('privacyModal');
const openPrivacy = document.getElementById('privacyOpen');
const closePrivacyBtn = document.getElementById('privacyClose');
const closePrivacyX = document.querySelector('.modal-x');
let untrapModal = null;
const closeModal = () => {
  privacyModal?.classList.remove('open');
  privacyModal?.setAttribute('aria-hidden', 'true');
  setScrollLock(false);
  if (untrapModal) untrapModal();
};
openPrivacy?.addEventListener('click', (e) => {
  e.preventDefault();
  privacyModal?.classList.add('open');
  privacyModal?.setAttribute('aria-hidden', 'false');
  setScrollLock(true);
  untrapModal = trapFocus(privacyModal.querySelector('.modal-card'), closeModal);
});
closePrivacyBtn?.addEventListener('click', closeModal);
closePrivacyX?.addEventListener('click', closeModal);
privacyModal?.addEventListener('click', (e) => { if (e.target === privacyModal) closeModal(); });

document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = document.createElement('p');
    note.className = 'form-sub';
    note.textContent = 'Thanks. After you sign up, you will see a clear setup checklist.';
    form.appendChild(note);
    form.reset();
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.card,.form-card,.performance-panel').forEach((el) => {
  el.style.transform = 'translateY(12px)';
  el.style.transition = 'transform .45s ease';
  observer.observe(el);
});
