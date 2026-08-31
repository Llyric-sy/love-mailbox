(() => {
  const bgm = document.getElementById('bgm');
  if (bgm) {
    try { bgm.pause(); } catch (_) {}
    bgm.removeAttribute('src');
    try { bgm.load(); } catch (_) {}
    bgm.remove();
  }
  document.querySelector('.music-ui')?.remove();
  localStorage.removeItem('bgm_on');
  localStorage.removeItem('bgm_vol');

  const menu = document.getElementById('monthMenu');
  if (menu && !menu.querySelector('[data-september-storybook]')) {
    const b = document.createElement('button');
    b.className = 'month-card';
    b.type = 'button';
    b.dataset.septemberStorybook = 'true';
    b.dataset.month = 'september';
    b.innerHTML = '<span class="month-name">september</span><span class="month-subtitle">the road after the storm.</span>';
    menu.appendChild(b);
  }

  const themes = {
    february: ['first pages.', '♥', 'little beginnings.'],
    march: ['growing closer.', '✦', 'soft things taking shape.'],
    april: ['heavenly bodies.', '☾', 'orbiting the same sky.'],
    may: ['meaningful petals.', '✿', 'things kept in bloom.'],
    june: ['little eternities.', '∞', 'small moments made lasting.'],
    july: ['painted scenery.', '⌁', 'a view worth keeping.'],
    august: ['beloved memories.', '☆', 'what we carried with us.']
  };

  const css = document.createElement('style');
  css.textContent = `
  body.mailbox-page{background:linear-gradient(180deg,#fff1dc,#f8e8d2);min-height:100vh}
  body.mailbox-page .month-section.unified-month{width:min(1160px,96vw)!important;max-width:none!important;margin:12px auto 0!important}
  body.mailbox-page .month-section.unified-month .month-header{min-height:74px!important;margin:0 0 14px!important;padding:0 86px!important;display:flex!important;align-items:center!important;justify-content:center!important;position:relative!important}
  body.mailbox-page .month-section.unified-month .back-btn{left:0!important;top:50%!important;transform:translateY(-50%)!important}
  body.mailbox-page .unified-heading{text-align:center}.unified-heading h3{margin:0;font-size:2rem;line-height:1.05;text-transform:lowercase}.unified-heading p{margin:5px 0 0;font-size:.9rem;opacity:.68;text-transform:lowercase}
  body.mailbox-page .unified-month-layout{height:min(650px,calc(100vh - 170px));min-height:480px;display:grid;grid-template-columns:minmax(260px,330px) minmax(0,1fr);gap:22px}
  body.mailbox-page .month-art-panel,body.mailbox-page .month-letters-pane{min-width:0;border-radius:22px;border:1px solid rgba(255,255,255,.72);background:rgba(255,249,241,.74);box-shadow:inset 0 0 28px rgba(137,105,76,.035),0 10px 28px rgba(91,61,40,.08)}
  body.mailbox-page .month-art-panel{position:relative;overflow:hidden;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 50% 22%,rgba(255,255,255,.7),transparent 38%),linear-gradient(180deg,#fbf4e9,#efe0ca)}
  .month-art-card{position:relative;width:min(235px,88%);aspect-ratio:.72;border-radius:20px;background:linear-gradient(180deg,#fffaf2,#f8ecdc);box-shadow:0 14px 28px rgba(84,57,38,.12);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;text-align:center;color:#71594a}
  .month-art-card:before,.month-art-card:after{content:'';position:absolute;top:-8px;width:58px;height:16px;border-radius:4px;background:rgba(211,184,149,.62)}.month-art-card:before{left:16px;transform:rotate(-6deg)}.month-art-card:after{right:16px;transform:rotate(6deg)}
  .month-art-symbol{width:100px;height:100px;display:grid;place-items:center;border-radius:50%;font-size:3rem;color:rgba(130,93,76,.72);background:rgba(225,200,180,.48)}.month-art-title{font-size:1.15rem;text-transform:lowercase}.month-art-note{max-width:165px;padding-top:12px;border-top:1px dashed rgba(113,82,65,.18);font-size:.76rem;line-height:1.5;opacity:.72;text-transform:lowercase}
  body.mailbox-page .month-letters-pane{overflow:hidden;padding:14px}body.mailbox-page .month-letters-pane .letters-grid{max-width:none!important;height:100%;overflow-y:auto;overscroll-behavior:contain;padding:4px 8px 6px 4px;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;align-content:start;gap:12px!important;scrollbar-width:thin;scrollbar-color:rgba(118,85,61,.28) transparent}body.mailbox-page .month-letters-pane .letters-grid::-webkit-scrollbar{width:8px}body.mailbox-page .month-letters-pane .letters-grid::-webkit-scrollbar-thumb{background:rgba(118,85,61,.24);border-radius:999px}
  body.mailbox-page .month-letters-pane .letter-card{min-height:66px!important;padding:18px 50px 18px 18px!important;border-radius:16px!important;background:rgba(255,252,247,.9)!important;box-shadow:0 6px 16px rgba(82,55,37,.09)!important}
  body.mailbox-page #february .month-header,body.mailbox-page #march .month-header{padding-top:0!important;margin-top:0!important}

  /* desktop: keep the month picker visible and open the chosen month underneath it */
  @media(min-width:721px){
    body.mailbox-page #monthMenu.hidden{display:grid!important}
    body.mailbox-page.desktop-month-open #monthMenu{width:min(1280px,96vw)!important;max-width:1280px!important;margin:16px auto 12px!important;grid-template-columns:repeat(8,minmax(0,1fr))!important;gap:10px!important}
    body.mailbox-page.desktop-month-open #monthMenu .month-card{aspect-ratio:1/1!important;min-height:0!important;padding:10px!important;border-radius:18px!important}
    body.mailbox-page.desktop-month-open #monthMenu .month-card::before{font-size:1.02rem!important}
    body.mailbox-page.desktop-month-open #monthMenu .month-card::after{margin-top:6px!important;font-size:.52rem!important}
    body.mailbox-page.desktop-month-open>h2{margin-bottom:8px!important}
    body.mailbox-page.desktop-month-open .month-section.unified-month:not(.hidden),
    body.mailbox-page.desktop-month-open .desktop-september-section:not(.hidden){width:min(1280px,96vw)!important;max-width:none!important;margin:0 auto 18px!important}
    body.mailbox-page.desktop-month-open .month-section.unified-month:not(.hidden) .month-header,
    body.mailbox-page.desktop-month-open .desktop-september-section:not(.hidden) .month-header{min-height:52px!important;margin:0 0 8px!important;padding:0 20px!important}
    body.mailbox-page.desktop-month-open .month-section.unified-month:not(.hidden) .back-btn{display:none!important}
    body.mailbox-page.desktop-month-open .unified-month-layout{height:52vh!important;min-height:380px!important;max-height:560px!important}
    body.mailbox-page.desktop-month-open .month-art-panel{padding:18px!important}
    body.mailbox-page.desktop-month-open .month-art-card{width:min(220px,84%)!important;aspect-ratio:.82!important}
  }

  /* mobile: selected month replaces the picker and shows every day on the page */
  @media(max-width:720px){
    body.mailbox-page #monthMenu.hidden{display:none!important}
    body.mailbox-page{padding:22px 16px!important}
    body.mailbox-page .month-section.unified-month{width:100%!important;margin-top:0!important}
    body.mailbox-page .month-section.unified-month .month-header{min-height:92px!important;padding:44px 0 0!important;margin-bottom:12px!important}
    body.mailbox-page .month-section.unified-month .back-btn{top:0!important;left:0!important;transform:none!important}
    .unified-heading h3{font-size:1.7rem}.unified-heading p{font-size:.82rem}
    body.mailbox-page .unified-month-layout{height:auto;min-height:0;display:flex;flex-direction:column;gap:16px}
    body.mailbox-page .month-letters-pane{order:1;padding:0;border:0;box-shadow:none;background:transparent;overflow:visible}
    body.mailbox-page .month-letters-pane .letters-grid{height:auto;overflow:visible;padding:0;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}
    body.mailbox-page .month-letters-pane .letter-card{min-height:72px!important;padding:18px 44px 18px 18px!important}
    body.mailbox-page .month-art-panel{order:2;min-height:245px;padding:24px 16px 30px}
    .month-art-card{width:min(220px,72vw);aspect-ratio:1.25}.month-art-symbol{width:72px;height:72px;font-size:2.2rem}.month-art-note{display:none}
  }

  /* September desktop day tray */
  .desktop-september-section{display:block}
  .desktop-september-section.hidden{display:none!important}
  .desktop-september-section .month-header{display:flex;align-items:center;justify-content:center;position:relative}
  .desktop-september-section .unified-heading{text-align:center}
  .desktop-september-section .unified-heading h3{margin:0;font-size:2rem;line-height:1.05;text-transform:lowercase}
  .desktop-september-section .unified-heading p{margin:5px 0 0;font-size:.9rem;opacity:.68;text-transform:lowercase}
  .sep-index-grid{height:100%;overflow-y:auto;overscroll-behavior:contain;padding:4px 8px 6px 4px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-content:start;gap:12px;scrollbar-width:thin;scrollbar-color:rgba(118,85,61,.28) transparent}
  .sep-index-grid::-webkit-scrollbar{width:8px}.sep-index-grid::-webkit-scrollbar-thumb{background:rgba(118,85,61,.24);border-radius:999px}
  .sep-index-card{position:relative;min-height:66px;padding:18px 50px 18px 18px;border:0;border-radius:16px;background:rgba(255,252,247,.9);color:#5c493c;text-align:left;font-family:Georgia,serif;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 6px 16px rgba(82,55,37,.09);transition:transform .15s ease,box-shadow .15s ease,opacity .15s ease}
  .sep-index-card:hover{transform:translateY(-1px);box-shadow:0 9px 18px rgba(82,55,37,.12)}
  .sep-index-card.locked{opacity:.45;cursor:not-allowed}.sep-index-card.locked::after{content:'🔒';position:absolute;right:16px;bottom:16px;font-size:.72rem;opacity:.65}
  .sep-index-card .favourite-star{position:absolute;right:13px;top:11px;width:30px;height:30px;border:0;background:transparent;color:#9f9f9f;font-size:1.3rem;line-height:1;cursor:pointer;padding:0}
  .sep-index-card.favourited .favourite-star{color:#b88d5b}

  .letter-envelope-stage{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:24px;background:rgba(42,30,25,.3);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .22s ease,visibility .22s ease;overflow:hidden}.letter-envelope-stage.is-active{opacity:1;visibility:visible;pointer-events:auto}.letter-envelope-close{position:absolute;top:max(14px,env(safe-area-inset-top));right:max(14px,env(safe-area-inset-right));z-index:20;width:40px;height:40px;border:0;border-radius:50%;background:rgba(255,250,244,.94);color:#6a5344;box-shadow:0 6px 16px rgba(58,39,29,.13);cursor:pointer;font-size:1.25rem}
  .letter-envelope-wrap{width:min(80vw,390px);aspect-ratio:1.48/1;position:relative;opacity:0;transform:translateY(48vh) scale(.72) rotate(1.5deg);filter:drop-shadow(0 20px 24px rgba(62,40,29,.2));transform-origin:center bottom}.letter-envelope-stage.is-active .letter-envelope-wrap{animation:env-arrive .72s cubic-bezier(.18,.82,.22,1.04) forwards}@keyframes env-arrive{0%{opacity:0;transform:translateY(48vh) scale(.72) rotate(1.5deg)}72%{opacity:1;transform:translateY(-8px) scale(1.012) rotate(-.2deg)}100%{opacity:1;transform:none}}
  .letter-envelope{position:absolute;inset:0;isolation:isolate;cursor:pointer;outline:none}.letter-envelope-back{position:absolute;inset:0;z-index:1;border-radius:16px;background:#ead4b7;border:1px solid rgba(121,87,58,.14);overflow:hidden}.letter-envelope-back:before,.letter-envelope-back:after{content:'';position:absolute;top:0;width:70%;height:100%;background:rgba(255,248,236,.28)}.letter-envelope-back:before{left:0;clip-path:polygon(0 0,100% 50%,0 100%)}.letter-envelope-back:after{right:0;clip-path:polygon(100% 0,0 50%,100% 100%)}
  .letter-envelope-preview{position:absolute;z-index:3;left:8%;right:8%;top:13%;height:76%;border-radius:10px 10px 6px 6px;background-color:#fffaf1;background-position:center;background-size:cover;background-repeat:no-repeat;box-shadow:0 7px 16px rgba(77,48,31,.14);transform:translateY(13%) scale(.93);transform-origin:center bottom;transition:transform .7s cubic-bezier(.18,.76,.18,1),opacity .36s ease;will-change:transform,opacity}.letter-envelope-pocket{position:absolute;inset:0;z-index:4;border-radius:0 0 16px 16px;overflow:hidden;pointer-events:none}.letter-envelope-pocket:before{content:'';position:absolute;inset:0;background:#e4c8a3;clip-path:polygon(0 16%,50% 67%,100% 16%,100% 100%,0 100%)}.letter-envelope-pocket:after{content:'';position:absolute;inset:0;background:rgba(255,244,226,.34);clip-path:polygon(0 100%,50% 51%,100% 100%)}.letter-envelope-flap{position:absolute;inset:0;z-index:5;transform-origin:50% 0;transition:transform .52s cubic-bezier(.35,.02,.2,1);pointer-events:none}.letter-envelope-flap:before{content:'';position:absolute;inset:0;border-radius:16px 16px 0 0;background:#f2dfc5;clip-path:polygon(0 0,100% 0,50% 69%)}.letter-envelope-seal{position:absolute;z-index:6;left:50%;top:55%;width:44px;height:44px;display:grid;place-items:center;transform:translate(-50%,-50%);border-radius:50%;background:#a96265;color:#fff7ee;box-shadow:0 4px 10px rgba(92,43,47,.22);transition:transform .22s ease,opacity .22s ease;pointer-events:none}.letter-envelope-tap{position:absolute;z-index:10;left:50%;bottom:-44px;transform:translateX(-50%);padding:8px 13px;border-radius:999px;background:rgba(255,250,244,.9);color:rgba(93,65,50,.78);box-shadow:0 5px 14px rgba(69,45,31,.09);font-size:.75rem;white-space:nowrap;opacity:0;transition:opacity .25s ease;pointer-events:none}.letter-envelope-stage.is-ready .letter-envelope-tap{opacity:1}.letter-envelope-stage.is-opening .letter-envelope-tap{opacity:0}.letter-envelope-stage.is-opening .letter-envelope-flap{z-index:2;transform:translateY(-67%) scaleY(-1)}.letter-envelope-stage.is-opening .letter-envelope-seal{opacity:0;transform:translate(-50%,-50%) scale(.72)}.letter-envelope-stage.is-lifting .letter-envelope-preview{z-index:8;transform:translateY(-92%) scale(1.03)}.letter-envelope-stage.is-handoff .letter-envelope-back,.letter-envelope-stage.is-handoff .letter-envelope-pocket,.letter-envelope-stage.is-handoff .letter-envelope-flap{opacity:0;transition:opacity .26s ease}.letter-envelope-stage.is-handoff .letter-envelope-preview{z-index:9;transform:translateY(-28%) scale(1.65);opacity:0;transition:transform .43s cubic-bezier(.22,.74,.18,1),opacity .34s ease}
  @media(max-width:480px){.letter-envelope-stage{padding:18px}.letter-envelope-wrap{width:min(84vw,340px)}.letter-envelope-tap{bottom:-50px}}@media(prefers-reduced-motion:reduce){.letter-envelope-stage *,.letter-envelope-stage{animation:none!important;transition:none!important}}
  `;
  document.head.appendChild(css);

  function unify(section) {
    if (!section || section.dataset.unified === 'true') return;
    const id = section.id;
    const t = themes[id] || ['', '♡', ''];
    const h = section.querySelector('.month-header');
    const g = section.querySelector('.letters-grid');
    if (!h || !g) return;

    let head = h.querySelector('.month-heading-text');
    if (!head) {
      head = document.createElement('div');
      head.className = 'month-heading-text';
      const back = h.querySelector('.back-btn');
      back ? back.insertAdjacentElement('afterend', head) : h.appendChild(head);
    }
    head.classList.add('unified-heading');
    if (!head.querySelector('h3')) head.insertAdjacentHTML('afterbegin', `<h3>${id}</h3>`);
    if (!head.querySelector('.section-subtitle') && t[0]) head.insertAdjacentHTML('beforeend', `<p class="section-subtitle">${t[0]}</p>`);

    const layout = document.createElement('div');
    const art = document.createElement('aside');
    const pane = document.createElement('div');
    layout.className = 'unified-month-layout';
    art.className = 'month-art-panel';
    pane.className = 'month-letters-pane';
    art.innerHTML = `<div class="month-art-card" aria-hidden="true"><div class="month-art-symbol">${t[1]}</div><div class="month-art-title">${id}.</div><div class="month-art-note">${t[2]}</div></div>`;
    g.before(layout);
    pane.appendChild(g);
    layout.append(art, pane);
    section.classList.add('unified-month');
    section.dataset.unified = 'true';
  }

  document.querySelectorAll('.month-section').forEach(unify);

  const FAVOURITES_KEY = 'mailbox_favourites_v1';
  function loadFavourites() {
    try { return JSON.parse(localStorage.getItem(FAVOURITES_KEY)) || []; }
    catch (_) { return []; }
  }
  function saveFavourites(items) {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(items));
  }
  function septemberUnlocked(day) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return new Date(2026, 8, day) <= today;
  }

  let desktopSeptemberSection = null;
  function ensureDesktopSeptemberSection() {
    if (desktopSeptemberSection) return desktopSeptemberSection;

    const section = document.createElement('section');
    section.className = 'desktop-september-section hidden';
    section.innerHTML = `
      <div class="month-header">
        <div class="unified-heading">
          <h3>september</h3>
          <p class="section-subtitle">the road after the storm.</p>
        </div>
      </div>
      <div class="unified-month-layout">
        <aside class="month-art-panel">
          <div class="month-art-card" aria-hidden="true">
            <div class="month-art-symbol">⌁</div>
            <div class="month-art-title">september.</div>
            <div class="month-art-note">the road after the storm.</div>
          </div>
        </aside>
        <div class="month-letters-pane"><div class="sep-index-grid"></div></div>
      </div>`;

    const grid = section.querySelector('.sep-index-grid');
    const favourites = loadFavourites();

    for (let day = 1; day <= 30; day += 1) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'sep-index-card';
      card.textContent = `sep ${String(day).padStart(2, '0')}`;

      if (!septemberUnlocked(day)) {
        card.disabled = true;
        card.classList.add('locked');
      } else {
        const id = `september-sep ${String(day).padStart(2, '0')}`;
        const star = document.createElement('button');
        star.type = 'button';
        star.className = 'favourite-star';
        star.setAttribute('aria-label', 'star this entry');
        star.textContent = favourites.includes(id) ? '★' : '☆';
        if (favourites.includes(id)) card.classList.add('favourited');

        star.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          const index = favourites.indexOf(id);
          if (index === -1) {
            favourites.push(id);
            card.classList.add('favourited');
            star.textContent = '★';
          } else {
            favourites.splice(index, 1);
            card.classList.remove('favourited');
            star.textContent = '☆';
          }
          saveFavourites(favourites);
        });

        card.appendChild(star);
        card.addEventListener('click', () => {
          location.href = `september.html?day=${day}`;
        });
      }
      grid.appendChild(card);
    }

    document.body.appendChild(section);
    desktopSeptemberSection = section;
    return section;
  }

  function hideDesktopMonths() {
    document.querySelectorAll('.month-section').forEach((section) => section.classList.add('hidden'));
    desktopSeptemberSection?.classList.add('hidden');
  }

  function showDesktopMonth(month) {
    hideDesktopMonths();
    let target = null;

    if (month === 'september') {
      target = ensureDesktopSeptemberSection();
    } else {
      target = document.getElementById(month);
    }

    if (!target) return;
    target.classList.remove('hidden');
    document.body.classList.add('desktop-month-open');
    requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'end' }));
  }

  if (menu) {
    menu.addEventListener('click', (event) => {
      const button = event.target.closest('.month-card');
      if (!button) return;
      const month = button.dataset.month || (button.dataset.septemberStorybook ? 'september' : '');
      if (!month) return;

      if (window.innerWidth <= 720) {
        if (month === 'september') {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          location.href = 'september.html';
        }
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      showDesktopMonth(month);
    }, true);
  }

  document.addEventListener('click', (event) => {
    const back = event.target.closest('.back-btn');
    if (!back || window.innerWidth <= 720) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    hideDesktopMonths();
    document.body.classList.remove('desktop-month-open');
  }, true);

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 720 && document.body.classList.contains('desktop-month-open')) {
      hideDesktopMonths();
      document.body.classList.remove('desktop-month-open');
    }
  });

  const stage = document.createElement('div');
  stage.className = 'letter-envelope-stage';
  stage.setAttribute('aria-hidden', 'true');
  stage.innerHTML = '<button class="letter-envelope-close" type="button" aria-label="close">×</button><div class="letter-envelope-wrap"><div class="letter-envelope" role="button" tabindex="0" aria-label="open letter"><div class="letter-envelope-back"></div><div class="letter-envelope-preview"></div><div class="letter-envelope-flap"></div><div class="letter-envelope-pocket"></div><div class="letter-envelope-seal">♥</div><div class="letter-envelope-tap">tap to open.</div></div></div>';
  document.body.appendChild(stage);

  const env = stage.querySelector('.letter-envelope');
  const preview = stage.querySelector('.letter-envelope-preview');
  const close = stage.querySelector('.letter-envelope-close');
  let card = null;
  let busy = false;
  let opening = false;
  let timers = [];

  const later = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timers.push(t);
    return t;
  };
  const clear = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };

  function reset() {
    clear();
    stage.classList.remove('is-active', 'is-ready', 'is-opening', 'is-lifting', 'is-handoff');
    stage.setAttribute('aria-hidden', 'true');
    preview.style.backgroundImage = '';
    card = null;
    busy = false;
    opening = false;
  }

  function reveal(c) {
    if (typeof window.openModal === 'function') {
      window.openModal(c.dataset.title, c.dataset.body, c.dataset.paper, c.dataset.audio);
    }
  }

  function present(c) {
    if (busy) return;
    busy = true;
    card = c;
    preview.style.backgroundImage = `url("images/stationery/${c.dataset.paper}")`;
    stage.classList.add('is-active');
    stage.setAttribute('aria-hidden', 'false');

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stage.classList.add('is-ready');
      env.focus({ preventScroll: true });
      return;
    }

    later(() => {
      stage.classList.add('is-ready');
      env.focus({ preventScroll: true });
    }, 720);
  }

  function open() {
    if (!card || opening || !stage.classList.contains('is-ready')) return;
    opening = true;
    stage.classList.remove('is-ready');

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const c = card;
      reset();
      reveal(c);
      return;
    }

    stage.classList.add('is-opening');
    later(() => stage.classList.add('is-lifting'), 470);
    later(() => stage.classList.add('is-handoff'), 1080);
    later(() => {
      const c = card;
      stage.classList.remove('is-active');
      stage.setAttribute('aria-hidden', 'true');
      if (c) reveal(c);
    }, 1420);
    later(reset, 1780);
  }

  env.addEventListener('click', open);
  env.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });
  close.addEventListener('click', (event) => {
    event.stopPropagation();
    reset();
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.favourite-star')) return;
    const c = event.target.closest('.letter-card');
    if (!c || c.disabled || c.classList.contains('locked')) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    present(c);
  }, true);
})();