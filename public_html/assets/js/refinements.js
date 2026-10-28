(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const videoUrl = 'https://res.cloudinary.com/dvijxvg4i/video/upload/v1793212923/Coinpre.mp4';
  document.querySelectorAll('.cp-submenu-toggle').forEach(button => {
    const item = button.parentElement;
    button.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      [...item.parentElement.children].forEach(sibling => {
        sibling.classList.remove('is-open');
        sibling.querySelector(':scope > .cp-submenu-toggle')?.setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
    });
  });
  const closeMenus = () => document.querySelectorAll('.cp-dropdown').forEach(item => {
    item.classList.remove('is-open');
    item.querySelector(':scope > button')?.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', e => { if (!e.target.closest('#cp-nav')) closeMenus(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenus(); });
  // Maintain a compact, softly translucent navigation bar while scrolling.
  const header = document.querySelector('.cp-header');
  let scrollFrame = 0;
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; updateHeader(); });
  }, {passive: true});
  updateHeader();

  // Automatic rotation: one change every 5 seconds. An arrow or dot
  // waits for 10 seconds of inactivity, then the five-second rhythm returns.
  function rotation(root, advance) {
    let visible = !('IntersectionObserver' in window), timer = 0, manualUntil = 0;
    root.querySelectorAll('[data-play]').forEach(button => button.remove());
    const schedule = () => {
      clearTimeout(timer);
      if (!visible || document.hidden || reduced.matches) return;
      const remaining = Math.max(0, manualUntil - Date.now());
      timer = setTimeout(() => {
        if (Date.now() < manualUntil) { schedule(); return; }
        advance();
        schedule();
      }, remaining + 5000);
    };
    const manual = () => { manualUntil = Date.now() + 10000; schedule(); };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        const nowVisible = entries[0].isIntersecting;
        if (visible !== nowVisible) { visible = nowVisible; schedule(); }
      }, {threshold: 0.12}).observe(root);
    }
    document.addEventListener('visibilitychange', schedule);
    reduced.addEventListener?.('change', schedule);
    schedule();
    return manual;
  }
  document.querySelectorAll('.cp-slideshow,.cp-gallery').forEach(root => {
    const gallery = root.classList.contains('cp-gallery');
    const slides = [...root.querySelectorAll(gallery ? '.cp-gallery-stage > img' : '.cp-slide')];
    const tabs = [...root.querySelectorAll(gallery ? '.cp-gallery-thumbs button' : '.cp-slide-dots button')];
    let current = 0;
    const show = next => {
      current = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === current;
        if (gallery) {
          slide.hidden = !active;
        } else {
          // Both slides remain laid out so opacity can crossfade without flashing.
          slide.hidden = false;
          slide.classList.toggle('is-active', active);
          slide.setAttribute('aria-hidden', String(!active));
          slide.inert = !active;
        }
      });
      tabs.forEach((tab, i) => tab.setAttribute('aria-pressed', String(i === current)));
      const count = root.querySelector('.cp-gallery-count');
      if (count) count.textContent = `${current + 1} / ${slides.length}`;
    };
    show(0);
    const manual = rotation(root, () => show(current + 1));
    root.querySelector('[data-prev]')?.addEventListener('click', () => { show(current - 1); manual(); });
    root.querySelector('[data-next]')?.addEventListener('click', () => { show(current + 1); manual(); });
    tabs.forEach((tab, i) => tab.addEventListener('click', () => { show(i); manual(); }));
  });
  document.querySelectorAll('.cp-catalog').forEach(root => {
    const track = root.querySelector('.cp-card-track');
    const controls = document.createElement('div'); controls.className = 'cp-catalog-controls';
    controls.innerHTML = '<button type="button" data-prev aria-label="Ver tarjetas anteriores"><span aria-hidden="true">‹</span></button><button type="button" data-next aria-label="Ver tarjetas siguientes"><span aria-hidden="true">›</span></button>';
    root.append(controls);
    const move = direction => {
      const step = track.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
      const max = track.scrollWidth - track.clientWidth;
      if (max < 4) return;
      let target = track.scrollLeft + direction * step;
      if (direction > 0 && track.scrollLeft >= max - 4) target = 0;
      if (direction < 0 && track.scrollLeft < 4) target = max;
      track.scrollTo({left: target, behavior: reduced.matches ? 'instant' : 'smooth'});
    };
    const manual = rotation(root, () => move(1));
    controls.querySelector('[data-prev]').addEventListener('click', () => { move(-1); manual(); });
    controls.querySelector('[data-next]').addEventListener('click', () => { move(1); manual(); });
  });

  // The required consent checkboxes remain exclusively inside contact forms.
  // Maps load by default; the video loads only after the visitor clicks play.
  function setupDialog(dialog) {
    if (!dialog) return () => {};
    let opener;
    dialog.querySelector('.cp-dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => opener?.focus());
    dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
    dialog.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const items = [...dialog.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),video[controls]')].filter(el => el.getClientRects().length && !el.closest('[hidden]'));
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    return trigger => { opener = trigger; dialog.showModal(); };
  }
  const videoDialog = document.querySelector('#cp-video-dialog');
  const showVideo = setupDialog(videoDialog);
  const video = videoDialog?.querySelector('video');
  const error = videoDialog?.querySelector('.cp-video-error');
  const unloadVideo = () => { if (!video) return; video.pause(); video.removeAttribute('src'); video.load(); video.hidden = true; };
  document.querySelectorAll('[data-video]').forEach(button => button.addEventListener('click', e => {
    e.preventDefault();
    if (!video) return;
    error.textContent = '';
    showVideo(button);
    video.hidden = false;
    video.src = videoUrl;
    video.play().catch(() => { error.textContent = 'Pulsa reproducir para comenzar el video.'; });
  }));
  video?.addEventListener('error', () => { if (video.getAttribute('src')) error.textContent = 'No fue posible cargar el video. Verifica tu conexión e inténtalo de nuevo.'; });
  videoDialog?.addEventListener('close', unloadVideo);
  document.querySelectorAll('[data-map]').forEach(box => {
    const frame = document.createElement('iframe');
    frame.title = 'Ubicación de COINPRE en Google Maps';
    frame.src = box.dataset.map;
    frame.loading = 'lazy';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allowFullscreen = true;
    box.replaceChildren(frame);
    box.classList.add('is-loaded');
  });

  // Mobile-only progressive enhancement. Nodes are moved, not copied:
  // form values, link destinations and original desktop markup are preserved.
  const mobileLayout = matchMedia('(max-width: 767px)');
  const optionalFormSections = [...document.querySelectorAll('.cp-form')].map(form => {
    const company = form.querySelector('[name="company"]')?.closest('label');
    const message = form.querySelector('[name="message"]')?.closest('label');
    if (!company || !message) return null;
    const companyHome = {parent: company.parentNode, next: company.nextSibling};
    const messageHome = {parent: message.parentNode, next: message.nextSibling};
    const section = document.createElement('details');
    section.className = 'cp-form-optional';
    const summary = document.createElement('summary');
    summary.textContent = 'Agregar empresa o mensaje (opcional)';
    const content = document.createElement('div');
    content.className = 'cp-form-optional-content';
    section.append(summary, content);
    return {form, company, message, companyHome, messageHome, section, content};
  }).filter(Boolean);
  const footerSections = [...document.querySelectorAll('.cp-footer-grid > div:nth-child(n+2)')].map(column => {
    const original = [...column.childNodes];
    const heading = column.querySelector(':scope > h2');
    if (!heading) return null;
    const details = document.createElement('details');
    details.className = 'cp-footer-accordion';
    const summary = document.createElement('summary');
    summary.textContent = heading.textContent;
    const content = document.createElement('div');
    content.className = 'cp-footer-accordion-content';
    details.append(summary, content);
    return {column, original, details, content};
  }).filter(Boolean);
  let mobileApplied = false;
  function applyMobileLayout() {
    if (mobileApplied === mobileLayout.matches) return;
    mobileApplied = mobileLayout.matches;
    for (const item of optionalFormSections) {
      if (mobileApplied) {
        item.content.append(item.company, item.message);
        item.form.querySelector('.cp-trap')?.before(item.section);
        item.section.open = false;
      } else {
        item.companyHome.parent.insertBefore(item.company, item.companyHome.next);
        item.messageHome.parent.insertBefore(item.message, item.messageHome.next);
        item.section.remove();
      }
    }
    for (const item of footerSections) {
      if (mobileApplied) {
        item.content.replaceChildren(...item.original);
        item.column.replaceChildren(item.details);
        item.details.open = false;
      } else {
        item.column.replaceChildren(...item.original);
      }
    }
  }
  mobileLayout.addEventListener?.('change', applyMobileLayout);
  applyMobileLayout();

  // Lightweight, one-time scroll reveals. The page stays fully visible when
  // JavaScript/IntersectionObserver is unavailable or reduced motion is set.
  if ('IntersectionObserver' in window && !reduced.matches) {
    const revealSelectors = [
      '.cp-page-hero .container',
      '.cp-site .section-title',
      '.process-two__single',
      '.cp-course-card',
      '.cp-product-card',
      '.product-details > .container > .row',
      '.related-products__title',
      '.cp-video-strip .container',
      '.cp-inquiry-intro',
      '.cp-inquiry-panel',
      '.cp-map-section > div',
      '.contact-info__single',
      '.service-two__top',
      '.cp-legal > h2',
      '.cp-legal > p',
      '.cp-legal > ul',
      '.cp-footer-grid > div',
      '.cp-footer-bottom'
    ];
    const revealItems = [...new Set(document.querySelectorAll(revealSelectors.join(',')))];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('cp-revealed');
        observer.unobserve(entry.target);
      });
    }, {threshold: 0.07, rootMargin: '0px 0px -5% 0px'});
    revealItems.forEach((element, index) => {
      element.setAttribute('data-cp-reveal', '');
      element.style.setProperty('--cp-reveal-delay', (index % 3) * 60 + 'ms');
    });
    revealItems.forEach(element => {
      const bounds = element.getBoundingClientRect();
      if (bounds.top < innerHeight * 0.94 && bounds.bottom > 0) {
        element.classList.add('cp-revealed');
      }
    });
    document.body.classList.add('cp-reveal-ready');
    revealItems.forEach(element => {
      if (!element.classList.contains('cp-revealed')) observer.observe(element);
    });
    document.addEventListener('focusin', event => {
      const element = event.target.closest?.('[data-cp-reveal]');
      if (element) { element.classList.add('cp-revealed'); observer.unobserve(element); }
    });
  }
})();
