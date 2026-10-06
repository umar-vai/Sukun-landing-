(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Top reading progress bar
  const track = document.createElement('div');
  track.className = 'scroll-progress-track';
  track.setAttribute('aria-hidden', 'true');
  const bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  track.appendChild(bar);
  document.body.prepend(track);

  const updateScrollProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.width = `${progress * 100}%`;
    document.body.classList.toggle('nav-scrolled', window.scrollY > 28);
  };
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });

  // Stagger existing reveal elements for a more cinematic flow
  document.querySelectorAll('.road-grid, .include-grid, .stats, .faq-grid').forEach(group => {
    [...group.children].forEach((el, index) => {
      el.style.setProperty('--reveal-delay', `${Math.min(index * 85, 360)}ms`);
    });
  });

  // Hero ambient cursor glow
  const hero = document.querySelector('.hero');
  if (hero && !reduceMotion) {
    const glow = document.createElement('div');
    glow.className = 'hero-glow';
    hero.appendChild(glow);
    const moveGlow = (e) => {
      const rect = hero.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    };
    hero.addEventListener('pointermove', moveGlow);
    hero.addEventListener('pointerleave', () => glow.style.opacity = '.25');
    hero.addEventListener('pointerenter', () => glow.style.opacity = '.75');

    // Decorative floating particles
    const particleData = [
      ['8%','20%','9px','11s','34px','-48px'],
      ['16%','72%','6px','8s','45px','-34px'],
      ['73%','18%','8px','10s','-32px','52px'],
      ['89%','64%','11px','13s','-42px','-58px'],
      ['59%','80%','5px','7s','31px','-44px'],
      ['42%','13%','7px','12s','-28px','46px']
    ];
    particleData.forEach(([left, top, size, dur, dx, dy]) => {
      const p = document.createElement('span');
      p.className = 'motion-particle';
      p.style.left = left;
      p.style.top = top;
      p.style.width = size;
      p.style.height = size;
      p.style.setProperty('--dur', dur);
      p.style.setProperty('--dx', dx);
      p.style.setProperty('--dy', dy);
      hero.appendChild(p);
    });
  }

  // Subtle 3D tilt for the hero summary card
  const heroCard = document.querySelector('.hero-card');
  if (heroCard && !reduceMotion) {
    heroCard.addEventListener('pointermove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - .5;
      const py = (e.clientY - rect.top) / rect.height - .5;
      heroCard.style.transform = `perspective(950px) rotateX(${py * -5}deg) rotateY(${px * 7}deg) translateY(-3px)`;
    });
    heroCard.addEventListener('pointerleave', () => {
      heroCard.style.transform = 'perspective(950px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  }

  // Add a visual 40-day progress strip to the hero card
  if (heroCard) {
    const startBox = heroCard.querySelector('.start-anytime');
    const challenge = document.createElement('div');
    challenge.className = 'challenge-progress';
    challenge.innerHTML = `
      <div class="challenge-progress-head"><span>৪০ দিনের যাত্রা</span><strong>৪টি ধাপ × ১০ দিন</strong></div>
      <div class="challenge-progress-rail"><div class="challenge-progress-fill"></div></div>`;
    if (startBox) startBox.insertAdjacentElement('beforebegin', challenge);
    else heroCard.appendChild(challenge);

    const fill = challenge.querySelector('.challenge-progress-fill');
    const challengeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => fill.style.width = '100%');
          challengeObserver.disconnect();
        }
      });
    }, { threshold: .45 });
    challengeObserver.observe(challenge);
  }

  // Count-up stats when they enter the viewport
  document.querySelectorAll('.stat strong').forEach(el => {
    // Keep rich stat markup (e.g. struck-through consultancy value + FREE label) intact.
    // The count-up animation rewrites textContent, so only animate plain-text stats.
    if (el.children.length > 0 || el.classList.contains('consult-stat-price')) return;
    const raw = el.textContent.trim();
    const numeric = Number(raw.replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(numeric) || numeric <= 0 || reduceMotion) return;
    const prefix = raw.startsWith('৳') ? '৳' : '';
    const suffix = raw.match(/[^0-9.]+$/)?.[0] || '';
    let played = false;
    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || played) return;
        played = true;
        const start = performance.now();
        const duration = numeric > 100 ? 1250 : 850;
        const tick = now => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const value = Math.round(numeric * eased);
          el.textContent = `${prefix}${value}${suffix}`;
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = raw;
        };
        requestAnimationFrame(tick);
        countObserver.disconnect();
      });
    }, { threshold: .5 });
    countObserver.observe(el);
  });

  // Pointer spotlight on content cards
  if (!reduceMotion) {
    document.querySelectorAll('.phase, .include, .soft-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });
  }

  // Active navigation indicator based on visible section
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sectionMap = new Map(navLinks.map(link => [link.getAttribute('href').slice(1), link]));
  const navObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => link.classList.remove('is-active'));
    const link = sectionMap.get(visible.target.id);
    if (link) link.classList.add('is-active');
  }, { rootMargin: '-25% 0px -55% 0px', threshold: [0,.1,.25,.5] });
  sectionMap.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) navObserver.observe(section);
  });

  // Smooth magnetic feel for primary CTAs
  if (!reduceMotion) {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * .08;
        const y = (e.clientY - rect.top - rect.height / 2) * .08;
        btn.style.transform = `translate(${x}px, ${y - 2}px) scale(1.015)`;
      });
      btn.addEventListener('pointerleave', () => btn.style.transform = '');
    });
  }
})();
