(() => {
  const mq = window.matchMedia('(max-width: 680px)');
  const header = document.querySelector('header .nav');
  if (!header) return;

  let toggle = document.querySelector('.mobile-menu-toggle');
  let panel = document.querySelector('.mobile-menu-panel');

  if (!toggle) {
    toggle = document.createElement('button');
    toggle.className = 'mobile-menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'মেনু খুলুন');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span>';
    header.appendChild(toggle);
  }

  if (!panel) {
    panel = document.createElement('nav');
    panel.className = 'mobile-menu-panel';
    panel.setAttribute('aria-label', 'মোবাইল নেভিগেশন');
    panel.innerHTML = `
      <a href="#program">প্রোগ্রাম</a>
      <a href="#included">যা পাবেন</a>
      <a href="#price">ফি</a>
      <a href="#faq">প্রশ্নোত্তর</a>
      <a href="#register">রেজিস্ট্রেশন</a>
    `;
    document.body.appendChild(panel);
  }

  const closeMenu = () => {
    document.body.classList.remove('mobile-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'মেনু খুলুন');
  };

  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('mobile-menu-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন');
  });

  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('mobile-menu-open')) return;
    if (panel.contains(e.target) || toggle.contains(e.target)) return;
    closeMenu();
  });

  window.addEventListener('resize', () => {
    if (!mq.matches) closeMenu();
  }, { passive: true });
})();
