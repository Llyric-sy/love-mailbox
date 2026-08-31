(() => {
  const STORIES = window.SEPTEMBER_STORIES || {};
  const DATE_LOCK_ENABLED = true;
  const YEAR = 2026;
  const FAVOURITES_KEY = 'mailbox_favourites_v1';

  const dayList = document.getElementById('dayList');
  const readerOverlay = document.getElementById('readerOverlay');
  const readerClose = document.getElementById('readerClose');
  const closedBook = document.getElementById('closedBook');
  const rightPage = document.getElementById('rightPage');
  const storyBody = document.getElementById('storyBody');
  const pageBack = document.getElementById('pageBack');
  const pageCount = document.getElementById('pageCount');
  const pageHint = document.getElementById('pageHint');
  const pageProgress = document.getElementById('pageProgress');
  const entryLabel = document.getElementById('entryLabel');
  const entryDate = document.getElementById('entryDate');
  const mobileEntry = document.getElementById('mobileEntry');
  const mobileDate = document.getElementById('mobileDate');

  const dayCardStyle = document.createElement('style');
  dayCardStyle.textContent = `
    .day-card .day {
      margin-top: 0 !important;
      font-size: 1rem !important;
      font-weight: 700 !important;
      line-height: 1.2;
    }
  `;
  document.head.appendChild(dayCardStyle);

  let activeDay = null;
  let pages = [];
  let pageIndex = 0;
  let turnTimer = null;

  function loadFavourites() {
    try { return JSON.parse(localStorage.getItem(FAVOURITES_KEY)) || []; }
    catch (_) { return []; }
  }
  function saveFavourites(items) {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(items));
  }
  function favouriteId(day) {
    return `september-sep ${String(day).padStart(2, '0')}`;
  }

  function todayStart() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  function isUnlocked(day) {
    return !DATE_LOCK_ENABLED || new Date(YEAR, 8, day) <= todayStart();
  }

  function pageBudget() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width <= 390) return height < 680 ? 340 : 410;
    if (width <= 720) return height < 760 ? 430 : 510;
    return 1120;
  }

  function paginate(paragraphs) {
    const budget = pageBudget();
    const out = [];
    let current = [];
    let count = 0;
    for (const paragraph of paragraphs) {
      if (current.length && count + paragraph.length > budget) {
        out.push(current);
        current = [];
        count = 0;
      }
      current.push(paragraph);
      count += paragraph.length;
    }
    if (current.length) out.push(current);
    return out.length ? out : [[]];
  }

  function renderPage() {
    storyBody.innerHTML = (pages[pageIndex] || []).map((p) => `<p>${p}</p>`).join('');
    pageCount.textContent = `${pageIndex + 1} / ${pages.length}`;
    pageHint.textContent = pageIndex < pages.length - 1 ? 'tap the page →' : 'end.';
    pageBack.classList.toggle('show', pageIndex > 0);
    pageProgress.style.width = `${((pageIndex + 1) / pages.length) * 100}%`;
  }

  function openStory(day) {
    if (!isUnlocked(day)) return;
    activeDay = day;
    pages = paginate(STORIES[day] || []);
    pageIndex = 0;
    const label = `entry ${String(day).padStart(2, '0')}`;
    const date = `sep. ${day}.`;
    entryLabel.textContent = label;
    entryDate.textContent = date;
    mobileEntry.textContent = label;
    mobileDate.textContent = date;
    renderPage();
    readerOverlay.classList.remove('opening');
    readerOverlay.classList.add('show');
    readerOverlay.setAttribute('aria-hidden','false');
    document.body.classList.add('reader-open');
    window.setTimeout(() => closedBook.focus({preventScroll:true}), 650);
  }

  function openBook() {
    if (!readerOverlay.classList.contains('show') || readerOverlay.classList.contains('opening')) return;
    readerOverlay.classList.add('opening');
  }

  function closeStory() {
    readerOverlay.classList.remove('show','opening');
    readerOverlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('reader-open');
    activeDay = null;
  }

  function turnTo(next) {
    if (!readerOverlay.classList.contains('opening')) return;
    if (next < 0 || next >= pages.length || next === pageIndex) return;
    rightPage.classList.add('turning');
    clearTimeout(turnTimer);
    turnTimer = window.setTimeout(() => {
      pageIndex = next;
      renderPage();
      rightPage.classList.remove('turning');
    }, 140);
  }

  const favourites = loadFavourites();
  for (let day = 1; day <= 30; day += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'day-card';
    button.dataset.day = String(day);
    button.innerHTML = `<span class="day">sep ${String(day).padStart(2,'0')}</span>`;

    const unlocked = isUnlocked(day);
    if (!unlocked) {
      button.disabled = true;
      button.classList.add('locked');
    } else {
      const id = favouriteId(day);
      const star = document.createElement('button');
      star.type = 'button';
      star.className = 'day-star';
      star.setAttribute('aria-label','star this entry');
      star.textContent = favourites.includes(id) ? '★' : '☆';
      if (favourites.includes(id)) button.classList.add('favourited');
      star.addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        const index = favourites.indexOf(id);
        if (index === -1) {
          favourites.push(id);
          button.classList.add('favourited');
          star.textContent = '★';
        } else {
          favourites.splice(index, 1);
          button.classList.remove('favourited');
          star.textContent = '☆';
        }
        saveFavourites(favourites);
      });
      button.appendChild(star);
      button.addEventListener('click', () => openStory(day));
    }
    dayList.appendChild(button);
  }

  closedBook.addEventListener('click', openBook);
  rightPage.addEventListener('click', (event) => {
    if (!readerOverlay.classList.contains('opening')) return;
    if (event.target.closest('#pageBack')) return;
    if (pageIndex < pages.length - 1) turnTo(pageIndex + 1);
  });
  pageBack.addEventListener('click', (event) => {
    event.stopPropagation();
    turnTo(pageIndex - 1);
  });
  readerClose.addEventListener('click', closeStory);
  readerOverlay.addEventListener('click', (event) => {
    if (event.target === readerOverlay) closeStory();
  });
  document.addEventListener('keydown', (event) => {
    if (!readerOverlay.classList.contains('show')) return;
    if (event.key === 'Escape') closeStory();
    if (!readerOverlay.classList.contains('opening')) return;
    if (event.key === 'ArrowRight' && pageIndex < pages.length - 1) turnTo(pageIndex + 1);
    if (event.key === 'ArrowLeft' && pageIndex > 0) turnTo(pageIndex - 1);
  });

  let touchStartX = null;
  rightPage.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0]?.clientX ?? null;
  }, {passive:true});
  rightPage.addEventListener('touchend', (event) => {
    if (!readerOverlay.classList.contains('opening') || touchStartX === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const delta = endX - touchStartX;
    if (Math.abs(delta) > 44) {
      if (delta < 0 && pageIndex < pages.length - 1) turnTo(pageIndex + 1);
      if (delta > 0 && pageIndex > 0) turnTo(pageIndex - 1);
    }
    touchStartX = null;
  }, {passive:true});

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (!activeDay) return;
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      pages = paginate(STORIES[activeDay] || []);
      pageIndex = Math.min(pageIndex, pages.length - 1);
      renderPage();
    }, 130);
  });
})();
