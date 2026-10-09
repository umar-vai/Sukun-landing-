'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';

const WHATSAPP_GROUPS = {
  male: 'https://chat.whatsapp.com/D5tbrLnAkCl2scAyrg21NS?s=cl&p=i&ilr=4&iam=2',
  female: 'https://chat.whatsapp.com/CJ5UeWWAeIkFQaLOKpw7Pl?s=cl&p=i&ilr=4&iam=2',
} as const;

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollProgressRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', menuOpen);
    return () => document.body.classList.remove('mobile-menu-open');
  }, [menuOpen]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: Array<() => void> = [];

    const updateScrollProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (scrollProgressRef.current) {
        scrollProgressRef.current.style.width = `${progress * 100}%`;
      }
      document.body.classList.toggle('nav-scrolled', window.scrollY > 28);
    };
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    cleanups.push(() => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
      document.body.classList.remove('nav-scrolled');
    });

    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((el) => revealObserver.observe(el));
    cleanups.push(() => revealObserver.disconnect());

    document.querySelectorAll<HTMLElement>('.road-grid, .include-grid, .stats, .faq-grid').forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        (child as HTMLElement).style.setProperty('--reveal-delay', `${Math.min(index * 85, 360)}ms`);
      });
    });

    const hero = document.querySelector<HTMLElement>('.hero');
    if (hero && !reduceMotion) {
      const glow = document.createElement('div');
      glow.className = 'hero-glow';
      hero.appendChild(glow);

      const particleData = [
        ['8%','20%','9px','11s','34px','-48px'],
        ['16%','72%','6px','8s','45px','-34px'],
        ['73%','18%','8px','10s','-32px','52px'],
        ['89%','64%','11px','13s','-42px','-58px'],
        ['59%','80%','5px','7s','31px','-44px'],
        ['42%','13%','7px','12s','-28px','46px']
      ];
      const particles: HTMLElement[] = [];
      particleData.forEach(([left, top, size, dur, dx, dy]) => {
        const p = document.createElement('span');
        p.className = 'motion-particle';
        Object.assign(p.style, { left, top, width: size, height: size });
        p.style.setProperty('--dur', dur);
        p.style.setProperty('--dx', dx);
        p.style.setProperty('--dy', dy);
        hero.appendChild(p);
        particles.push(p);
      });

      const moveGlow = (event: PointerEvent) => {
        const rect = hero.getBoundingClientRect();
        glow.style.left = `${event.clientX - rect.left}px`;
        glow.style.top = `${event.clientY - rect.top}px`;
      };
      const dimGlow = () => { glow.style.opacity = '.25'; };
      const brightenGlow = () => { glow.style.opacity = '.75'; };
      hero.addEventListener('pointermove', moveGlow);
      hero.addEventListener('pointerleave', dimGlow);
      hero.addEventListener('pointerenter', brightenGlow);
      cleanups.push(() => {
        hero.removeEventListener('pointermove', moveGlow);
        hero.removeEventListener('pointerleave', dimGlow);
        hero.removeEventListener('pointerenter', brightenGlow);
        glow.remove();
        particles.forEach((p) => p.remove());
      });
    }

    const heroCard = document.querySelector<HTMLElement>('.hero-card');
    if (heroCard && !reduceMotion) {
      const tilt = (event: PointerEvent) => {
        const rect = heroCard.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        heroCard.style.transform = `perspective(950px) rotateX(${py * -5}deg) rotateY(${px * 7}deg) translateY(-3px)`;
      };
      const resetTilt = () => {
        heroCard.style.transform = 'perspective(950px) rotateX(0deg) rotateY(0deg) translateY(0)';
      };
      heroCard.addEventListener('pointermove', tilt);
      heroCard.addEventListener('pointerleave', resetTilt);
      cleanups.push(() => {
        heroCard.removeEventListener('pointermove', tilt);
        heroCard.removeEventListener('pointerleave', resetTilt);
      });
    }

    const challenge = document.querySelector<HTMLElement>('.challenge-progress');
    const challengeFill = document.querySelector<HTMLElement>('.challenge-progress-fill');
    if (challenge && challengeFill) {
      const challengeObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          requestAnimationFrame(() => { challengeFill.style.width = '100%'; });
          challengeObserver.disconnect();
        }
      }, { threshold: 0.45 });
      challengeObserver.observe(challenge);
      cleanups.push(() => challengeObserver.disconnect());
    }

    if (!reduceMotion) {
      document.querySelectorAll<HTMLElement>('.phase, .include, .soft-card').forEach((card) => {
        const spotlight = (event: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
          card.style.setProperty('--my', `${event.clientY - rect.top}px`);
        };
        card.addEventListener('pointermove', spotlight);
        cleanups.push(() => card.removeEventListener('pointermove', spotlight));
      });

      document.querySelectorAll<HTMLElement>('.btn-primary').forEach((btn) => {
        const magnetic = (event: PointerEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
          const y = (event.clientY - rect.top - rect.height / 2) * 0.08;
          btn.style.transform = `translate(${x}px, ${y - 2}px) scale(1.015)`;
        };
        const reset = () => { btn.style.transform = ''; };
        btn.addEventListener('pointermove', magnetic);
        btn.addEventListener('pointerleave', reset);
        cleanups.push(() => {
          btn.removeEventListener('pointermove', magnetic);
          btn.removeEventListener('pointerleave', reset);
        });
      });
    }

    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-links a[href^="#"]'));
    const sectionMap = new Map(
      navLinks.map((link) => [link.getAttribute('href')?.slice(1) || '', link] as const)
    );
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.remove('is-active'));
      sectionMap.get(visible.target.id)?.classList.add('is-active');
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5] });
    sectionMap.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) navObserver.observe(section);
    });
    cleanups.push(() => navObserver.disconnect());

    const closeOnOutsideClick = (event: MouseEvent) => {
      const panel = document.querySelector('.mobile-menu-panel');
      const toggle = document.querySelector('.mobile-menu-toggle');
      if (!document.body.classList.contains('mobile-menu-open')) return;
      if (panel?.contains(event.target as Node) || toggle?.contains(event.target as Node)) return;
      setMenuOpen(false);
    };
    document.addEventListener('click', closeOnOutsideClick);
    cleanups.push(() => document.removeEventListener('click', closeOnOutsideClick));

    const media = window.matchMedia('(max-width: 680px)');
    const closeOnDesktop = () => {
      if (!media.matches) setMenuOpen(false);
    };
    media.addEventListener('change', closeOnDesktop);
    cleanups.push(() => media.removeEventListener('change', closeOnDesktop));

    return () => cleanups.reverse().forEach((cleanup) => cleanup());
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const gender = String(data.get('gender') || '');

    if (gender !== 'male' && gender !== 'female') return;

    const destination = WHATSAPP_GROUPS[gender];
    let redirected = false;

    const goToGroup = () => {
      if (redirected) return;
      redirected = true;
      window.location.assign(destination);
    };

    const trackingWindow = window as typeof window & {
      dataLayer?: Array<Record<string, unknown>>;
    };

    trackingWindow.dataLayer = trackingWindow.dataLayer || [];
    trackingWindow.dataLayer.push({
      event: 'challenge_registration_submit',
      registration_destination: 'whatsapp_group',
      eventCallback: goToGroup,
      eventTimeout: 800,
    });

    window.setTimeout(goToGroup, 900);
  };

  return (
    <>

  <div className="scroll-progress-track" aria-hidden="true">
    <div className="scroll-progress-bar" ref={scrollProgressRef}></div>
  </div>

  <header>
    <div className="container nav">
      <a className="brand" href="#top" aria-label="SukunLife">
        <img src="https://www.sukunlife.com/_next/static/media/logo-big.93426c9f.png" alt="SukunLife" />
        <span className="brand-fallback">SUKUNLIFE</span>
      </a>
      <nav className="nav-links" aria-label="প্রধান নেভিগেশন">
        <a href="#program">প্রোগ্রাম</a>
        <a href="#included">যা থাকছে</a>
        <a href="#price">সম্পূর্ণ ফ্রি</a>
        <a href="#faq">প্রশ্নোত্তর</a>
      </nav>
      <div className="nav-cta">
        <span className="price-mini">সম্পূর্ণ ফ্রি</span>
        <a className="btn btn-primary" href="#register">রেজিস্ট্রেশন করুন</a>
      </div>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span></span>
      </button>
    </div>
  </header>

  <nav className="mobile-menu-panel" aria-label="মোবাইল নেভিগেশন">
    <a href="#program" onClick={closeMenu}>প্রোগ্রাম</a>
    <a href="#included" onClick={closeMenu}>যা থাকছে</a>
    <a href="#price" onClick={closeMenu}>সম্পূর্ণ ফ্রি</a>
    <a href="#faq" onClick={closeMenu}>প্রশ্নোত্তর</a>
    <a href="#register" onClick={closeMenu}>রেজিস্ট্রেশন</a>
  </nav>

  <main id="top">
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy reveal">
          <span className="eyebrow"><span className="dot"></span>SukunLife-এর ৪০ দিনের আয়োজন</span>
          <h1>জাদু থেকে সুরক্ষার <span>৪০ দিনের চ্যালেঞ্জ</span></h1>
          <p className="lead">উদ্দেশ্য ভয় তৈরি করা নয়। কুরআন-সুন্নাহভিত্তিক আমলগুলো নিয়মিত ও গুছিয়ে করার জন্য এই ৪০ দিনের আয়োজন। কোন দিনে কী করবেন, ধাপে ধাপে সামনে থাকবে।</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#register">ফ্রি রেজিস্ট্রেশন করুন</a>
            <a className="btn btn-light" href="#included">কী কী থাকছে দেখুন</a>
          </div>
          <div className="social-proof" aria-label="অংশগ্রহণকারীর সংখ্যা">
            <span className="proof-number">২৫,০০০+</span>
            <span className="proof-text">মানুষ ইতিমধ্যে এই চ্যালেঞ্জে অংশ নিয়েছেন</span>
          </div>
          <div className="micro">
            <span><i className="check">✓</i> যেকোনো দিন শুরু করতে পারবেন</span>
            <span><i className="check">✓</i> ৪০ দিনের সাজানো পরিকল্পনা</span>
            <span><i className="check">✓</i> লাইভে প্রশ্ন করার সুযোগ</span>
          </div>
        </div>

        <aside className="hero-card reveal" aria-label="প্রোগ্রাম সারাংশ">
          <div className="kicker">Protection Challenge</div>
          <div className="days">40</div>
          <div className="days-label">দিনের সাজানো আমল ও রুটিন</div>
          <div className="hero-list">
            <div><i className="check">✓</i><span><b>প্রতিদিন কী করবেন</b><small>সহজভাবে সাজানো থাকবে</small></span></div>
            <div><i className="check">✓</i><span><b>১টি বিশেষ ওয়েবিনার + লাইভ প্রশ্নোত্তর</b><small>প্রয়োজনীয় বিষয়গুলো নিয়ে সরাসরি আলোচনা</small></span></div>
            <div><i className="check">✓</i><span><b>প্ল্যানার, ট্র্যাকার ও নোটস</b><small>কাজগুলো নিয়মিত রাখতে সাহায্য করবে</small></span></div>
          </div>
          <div className="challenge-progress">
            <div className="challenge-progress-head"><span>৫ ধাপে ৪০ দিনের যাত্রা</span><strong>মোট ৪০ দিন</strong></div>
            <div className="challenge-progress-rail"><div className="challenge-progress-fill"></div></div>
          </div>
          <div className="start-anytime">রেজিস্ট্রেশন করার দিন থেকেই আপনার ৪০ দিন শুরু হবে।</div>
        </aside>
      </div>
    </section>

    <div className="container stats-wrap reveal">
      <div className="stats">
        <div className="stat stat-inline"><span>বিশেষ ওয়েবিনার</span></div>
        <div className="stat stat-inline"><span>লাইভ প্রশ্নোত্তর</span></div>
        <div className="stat stat-inline"><span>৪০ দিনের পূর্ণ প্ল্যান</span></div>
        <div className="stat"><strong>✓</strong><span>প্ল্যানার, ট্র্যাকার ও নোটস</span></div>
      </div>
    </div>

    <section className="section" id="program">
      <div className="container intro-grid">
        <div className="reveal">
          <span className="eyebrow"><span className="dot"></span>কেন এই ৪০ দিন</span>
          <h2>আমল জানা আর নিয়মিত আমল করা এক জিনিস নয়।</h2>
          <p className="lead">অনেকেই কী কী আমল করতে হয় জানেন। কিন্তু ব্যস্ততার মধ্যে কখন কোনটা করবেন, নিয়ম ধরে রাখবেন কীভাবে, একদিন বাদ গেলে আবার কোথা থেকে শুরু করবেন, সেখানেই ঝামেলা হয়। এই চ্যালেঞ্জে ৪০ দিন ধরে কাজগুলো ধাপে ধাপে গুছিয়ে দেওয়া থাকবে।</p>
          <div className="reassurance">এখানে ভয় দেখানো বা কারও সমস্যা আছে ধরে নেওয়ার বিষয় নেই। উদ্দেশ্য হলো কুরআন-সুন্নাহভিত্তিক আমলগুলো নিয়মিত জীবনের অংশ করে নেওয়া।</div>
        </div>
        <div className="soft-card quote-card reveal">
          <div className="big-mark">“</div>
          <h3>প্রতিদিন কী করবেন, সামনে থাকবে</h3>
          <p className="muted">শুধু শুনে রেখে দেওয়ার আয়োজন নয়। কোন দিনে কী করবেন, কী নোট করবেন, কোথায় প্রশ্ন করবেন। সবকিছু এক জায়গায় সাজানো থাকবে।</p>
          <div className="value-list">
            <div className="value-item"><i className="check">✓</i><span>নিজের সুবিধামতো দৈনিক রুটিন গুছিয়ে নেওয়া</span></div>
            <div className="value-item"><i className="check">✓</i><span>যে জায়গাগুলো নিয়ে দ্বিধা আছে, সেগুলো পরিষ্কার করার সুযোগ</span></div>
            <div className="value-item"><i className="check">✓</i><span>ট্র্যাকার দেখে নিয়ম ধরে রাখা সহজ করা</span></div>
          </div>
        </div>
      </div>
    </section>

    <section className="section roadmap">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot"></span>৪০ দিনের পরিকল্পনা</span>
          <h2>ধাপে ধাপে নিজের ভিতর পরিবর্তন আনুন</h2>
        </div>
        <div className="road-grid">
          <article className="phase reveal">
            <div className="phase-num"><span className="num">০১</span><span className="ten">দিন ১–৯</span></div>
            <h3>প্রস্তুতি পর্ব</h3>
            <p className="muted">একটু একটু করে রুকইয়াহর সঙ্গে আত্মা ও দেহের সম্পর্ক গড়ে উঠবে।</p>
          </article>
          <article className="phase reveal">
            <div className="phase-num"><span className="num">০২</span><span className="ten">দিন ১০–১২</span></div>
            <h3>নজরের আমল</h3>
            <p className="muted">ভেতরে লুকিয়ে থাকা সমস্যাগুলো ধীরে ধীরে প্রকাশ পেতে শুরু করবে।</p>
          </article>
          <article className="phase reveal">
            <div className="phase-num"><span className="num">০৩</span><span className="ten">দিন ১৩–১৯</span></div>
            <h3>বরই পাতার আমল</h3>
            <p className="muted">ভেতরে থাকা জাদুর প্রভাব ধীরে ধীরে দুর্বল হতে শুরু করবে।</p>
          </article>
          <article className="phase reveal">
            <div className="phase-num"><span className="num">০৪</span><span className="ten">দিন ২০–২৬</span></div>
            <h3>আশফিয়া ডিটক্স</h3>
            <p className="muted">শরীরের ভেতরে থাকা ‘উকদ’ ও ‘হুসুন’ ধীরে ধীরে দুর্বল হতে শুরু করবে।</p>
          </article>
          <article className="phase reveal">
            <div className="phase-num"><span className="num">০৫</span><span className="ten">দিন ২৭–৪০</span></div>
            <h3>জাদুর ডিটক্স</h3>
            <p className="muted">দেহে থাকা পুরোনো জাদু ও গিট ধীরে ধীরে ধ্বংস হয়ে জাদু প্রতিরোধী দেহ গড়ে উঠবে, ইনশাআল্লাহ।</p>
          </article>
        </div>
      </div>
    </section>

    <section className="section inclusions" id="included">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot"></span>যা যা থাকছে</span>
          <h2>প্রয়োজনীয় জিনিসগুলো এক জায়গায়</h2>
          <p className="lead" style={{ marginInline: 'auto' }}>প্রতিদিন কী করবেন, কোথায় নোট রাখবেন, কীভাবে নিজের অগ্রগতি দেখবেন আর কোথায় প্রশ্ন করবেন। এসবের জন্য দরকারি জিনিসগুলো একসাথে থাকবে।</p>
        </div>
        <div className="include-grid">
          <article className="include reveal"><div className="icon"><svg viewBox="0 0 24 24"><path d="M4 5h16M4 12h16M4 19h10"/></svg></div><h3>৪০ দিনের পূর্ণ প্ল্যান</h3><p className="muted">প্রতিদিন কী করবেন, সেটা আগে থেকেই সাজানো থাকবে। আলাদা করে পরিকল্পনা করতে হবে না।</p></article>
          <article className="include reveal"><div className="icon"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></svg></div><h3>১টি বিশেষ ওয়েবিনারে অ্যাক্সেস</h3><p className="muted">চ্যালেঞ্জের গুরুত্বপূর্ণ বিষয় ও আমল নিয়ে একটি বিশেষ ওয়েবিনারে অংশ নিতে পারবেন।</p></article>
          <article className="include reveal"><div className="icon"><svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 1 1-4.8-7.33"/><path d="M21 3v6h-6"/></svg></div><h3>লাইভ প্রশ্নোত্তর</h3><p className="muted">যে প্রশ্নগুলো থাকবে, সেগুলো লাইভে সরাসরি জিজ্ঞেস করতে পারবেন।</p></article>
          <article className="include reveal"><div className="icon"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5z"/><path d="M4 6.5v13"/></svg></div><h3>প্ল্যানার, ট্র্যাকার ও নোটস</h3><p className="muted">প্রতিদিনের আমল টিক দেওয়া, নিজের অগ্রগতি দেখা আর দরকারি কথা লিখে রাখার জন্য।</p></article>
          
        </div>

      </div>
    </section>

    <section className="section pricing" id="price">
      <div className="container price-grid">
        <div className="reveal">
          <span className="eyebrow"><span className="dot"></span>রেজিস্ট্রেশন ফি নেই</span>
          <h2>পুরো ৪০ দিনের আয়োজনটি সম্পূর্ণ ফ্রি</h2>
          <p className="lead">রেজিস্ট্রেশন করার পর ৪০ দিনের প্ল্যান, প্ল্যানার, ট্র্যাকার ও নোটস পাবেন। কোথাও বুঝতে সমস্যা হলে লাইভ প্রশ্নোত্তরে জিজ্ঞেস করতে পারবেন।</p>
          <div className="value-list">
            <div className="value-item"><i className="check">✓</i><span>৪০ দিনের প্ল্যান, প্ল্যানার, ট্র্যাকার ও নোটস</span></div>
          </div>
        </div>
        <aside className="price-card reveal">
          <div className="price-label">রেজিস্ট্রেশন ফি</div>
          <div className="price">ফ্রি</div>
          <p className="price-note">কোনো ফি লাগবে না। পুরো আয়োজনটি সম্পূর্ণ ফ্রি।</p>
          <span className="consult-value">৪০ দিনের প্ল্যান ও প্রয়োজনীয় উপকরণ</span>
          <a className="btn btn-primary btn-wide" href="#register">ফ্রি রেজিস্ট্রেশন করুন</a>
          <div className="secure">রেজিস্ট্রেশন শেষে আপনার নির্বাচিত WhatsApp গ্রুপে নিয়ে যাওয়া হবে।</div>
        </aside>
      </div>
    </section>

    <section className="section register" id="register">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot"></span>রেজিস্ট্রেশন</span>
          <h2>রেজিস্ট্রেশন করতে এই ৪টি তথ্য দিন</h2>
          <p className="lead" style={{ marginInline: 'auto' }}>নাম, WhatsApp নম্বর, Gmail ঠিকানা এবং পুরুষ বা মহিলা নির্বাচন করুন। সাবমিট করলেই আপনার জন্য নির্ধারিত WhatsApp গ্রুপ খুলবে।</p>
        </div>
        <div className="form-shell reveal">
          <aside className="form-info">
            <h3>যোগাযোগ</h3>
            <p>রেজিস্ট্রেশন নিয়ে কোনো প্রশ্ন থাকলে এই নম্বরে WhatsApp করতে পারেন।</p>
            <div className="contact-row"><small>হেল্পলাইন / WhatsApp</small><strong>01887 753555</strong></div>
            <div className="contact-row"><small>সময়</small><strong>সকাল ১০টা – রাত ১০টা</strong></div>
          </aside>
          <form id="regForm" onSubmit={handleSubmit}>
            <div className="field"><label htmlFor="name">নাম</label><input id="name" name="name" required placeholder="আপনার নাম" autoComplete="name" /></div>
            <div className="field"><label htmlFor="phone">হোয়াটসঅ্যাপ নাম্বার</label><input id="phone" name="phone" required inputMode="tel" placeholder="01XXXXXXXXX" autoComplete="tel" /></div>
            <div className="field"><label htmlFor="email">জিমেইল</label><input id="email" name="email" type="email" required placeholder="example@gmail.com" autoComplete="email" /></div>
            <div className="field">
              <label htmlFor="gender">লিঙ্গ নির্বাচন করুন</label>
              <select id="gender" name="gender" required defaultValue="">
                <option value="" disabled>পুরুষ বা মহিলা নির্বাচন করুন</option>
                <option value="male">পুরুষ</option>
                <option value="female">মহিলা</option>
              </select>
            </div>
            <button className="btn btn-primary btn-wide" type="submit">রেজিস্ট্রেশন করে গ্রুপে যোগ দিন</button>
            <p className="form-note">সাবমিট করলে আপনার নির্বাচিত WhatsApp গ্রুপ খুলবে। এই ওয়েবসাইটে আপনার তথ্য সেভ হবে না।</p>
          </form>
        </div>
      </div>
    </section>

    <section className="section" id="faq">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot"></span>প্রশ্ন থাকলে</span>
          <h2>রেজিস্ট্রেশনের আগে যে প্রশ্নগুলো বেশি আসে</h2>
        </div>
        <div className="faq-grid">
          <details className="reveal"><summary>মাসের মাঝামাঝি বা শেষে কি শুরু করতে পারব?</summary><p>হ্যাঁ। নির্দিষ্ট কোনো শুরুর তারিখ নেই। আপনি যেদিন রেজিস্ট্রেশন করবেন, সেদিন থেকেই আপনার ৪০ দিন শুরু হবে।</p></details>

          <details className="reveal"><summary>আমার প্যারানরমাল কোনো সমস্যা নেই। তবুও কি এই চ্যালেঞ্জে যোগ দেওয়া যাবে?</summary><p>যাবে। এখানে কারও কোনো সমস্যা আছে ধরে নেওয়া হচ্ছে না। আপনি যদি কুরআন-সুন্নাহভিত্তিক সুরক্ষার আমলগুলো নিয়মিত করতে চান, তাহলে এই ৪০ দিনের পরিকল্পনা অনুসরণ করতে পারেন।</p></details>

          <details className="reveal"><summary>রুকইয়াহ সম্পর্কে কিছুই জানি না। আমি কি বুঝতে পারব?</summary><p>পারবেন। একদম শুরু থেকে বোঝার মতো করে ধাপগুলো সাজানো থাকবে। আগে থেকে রুকইয়াহ জানা জরুরি নয়; যেটা বুঝবেন না, লাইভ প্রশ্নোত্তরে জিজ্ঞেস করতে পারবেন।</p></details>

        </div>
        <div className="disclaimer reveal"><strong>গুরুত্বপূর্ণ:</strong> এই আয়োজন চিকিৎসার বিকল্প নয়। শারীরিক বা মানসিক কোনো সমস্যা থাকলে প্রয়োজন অনুযায়ী চিকিৎসক বা মানসিক স্বাস্থ্য পেশাজীবীর পরামর্শ নিন।</div>
      </div>
    </section>
  </main>

  <footer>
    <div className="container">
      <div className="footer-grid">
        <div>
          <div className="footer-brand"><img src="https://www.sukunlife.com/_next/static/media/logo-big.93426c9f.png" alt="SukunLife" /><strong>SukunLife</strong></div>
          <p style={{ maxWidth: 560 }}>কুরআন-সুন্নাহভিত্তিক রুকইয়াহ, কাউন্সেলিং ও সচেতনতা নিয়ে কাজ করে SukunLife।</p>
        </div>
        <div className="footer-contact">
          <div>হেল্পলাইন / WhatsApp: <a href="tel:+8801887753555">01887 753555</a></div>
          <div><a href="https://www.sukunlife.com/" target="_blank" rel="noopener">sukunlife.com</a></div>
        </div>
      </div>
      <div className="copyright">© SukunLife. All rights reserved.</div>
    </div>
  </footer>

  <div className="mobile-bar" aria-label="মোবাইল রেজিস্ট্রেশন বার">
    <span className="m-price">ফ্রি</span>
    <a className="btn btn-primary" href="#register">রেজিস্ট্রেশন করুন</a>
  </div>

  
    </>
  );
}
