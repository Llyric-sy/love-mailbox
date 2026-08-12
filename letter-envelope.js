(() => {
  const LETTER_SELECTOR = '.letter-card';

  const style = document.createElement('style');
  style.textContent = `
    .letter-envelope-stage {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: grid;
      place-items: center;
      padding: 24px;
      background: rgba(39, 28, 24, 0.34);
      -webkit-backdrop-filter: blur(3px);
      backdrop-filter: blur(3px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 220ms ease, visibility 220ms ease;
      overflow: hidden;
    }

    .letter-envelope-stage.is-active {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .letter-envelope-wrap {
      width: min(78vw, 360px);
      aspect-ratio: 1.55 / 1;
      position: relative;
      overflow: visible;
      opacity: 0;
      transform: translateY(58vh) scale(0.86) rotate(2deg);
      filter: drop-shadow(0 20px 24px rgba(62, 40, 29, 0.28));
    }

    .letter-envelope-stage.is-active .letter-envelope-wrap {
      animation: letter-envelope-arrive 680ms cubic-bezier(.2,.82,.23,1.08) forwards;
    }

    @keyframes letter-envelope-arrive {
      0% {
        opacity: 0;
        transform: translateY(58vh) scale(0.86) rotate(2deg);
      }
      72% {
        opacity: 1;
        transform: translateY(-10px) scale(1.025) rotate(-0.5deg);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1) rotate(0deg);
      }
    }

    .letter-envelope {
      position: absolute;
      inset: 0;
      overflow: visible;
      isolation: isolate;
    }

    .letter-envelope-back {
      position: absolute;
      inset: 0;
      z-index: 1;
      border-radius: 10px;
      background: #ead7bc;
      border: 1px solid rgba(121, 87, 58, 0.16);
      overflow: hidden;
    }

    .letter-envelope-back::before,
    .letter-envelope-back::after {
      content: '';
      position: absolute;
      top: 0;
      width: 70%;
      height: 100%;
      background: rgba(255, 248, 235, 0.34);
    }

    .letter-envelope-back::before {
      left: 0;
      clip-path: polygon(0 0, 100% 50%, 0 100%);
    }

    .letter-envelope-back::after {
      right: 0;
      clip-path: polygon(100% 0, 0 50%, 100% 100%);
    }

    .letter-envelope-preview {
      position: absolute;
      z-index: 3;
      left: 9%;
      right: 9%;
      top: 15%;
      height: 72%;
      border-radius: 7px 7px 4px 4px;
      background-color: #fffaf1;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      box-shadow: 0 5px 14px rgba(77, 48, 31, 0.18);
      transform: translateY(10%) scale(0.92);
      transform-origin: center bottom;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      will-change: transform, opacity;
      transition:
        transform 820ms cubic-bezier(.2,.76,.2,1),
        opacity 360ms ease,
        filter 360ms ease;
    }

    .letter-envelope-preview::after {
      content: 'for my love';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(255, 250, 244, 0.74);
      color: rgba(92, 61, 47, 0.76);
      font-family: inherit;
      font-size: 0.8rem;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(70, 44, 30, 0.08);
    }

    .letter-envelope-pocket {
      position: absolute;
      inset: 0;
      z-index: 4;
      border-radius: 0 0 10px 10px;
      overflow: hidden;
      pointer-events: none;
    }

    .letter-envelope-pocket::before {
      content: '';
      position: absolute;
      inset: 0;
      background: #e4c9a5;
      clip-path: polygon(0 17%, 50% 66%, 100% 17%, 100% 100%, 0 100%);
      border-bottom: 1px solid rgba(110, 76, 49, 0.13);
    }

    .letter-envelope-pocket::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255, 244, 226, 0.34);
      clip-path: polygon(0 100%, 50% 51%, 100% 100%);
    }

    .letter-envelope-flap {
      position: absolute;
      inset: 0;
      z-index: 5;
      transform-origin: 50% 0%;
      transform: translateY(0) scaleY(1);
      transition: transform 650ms cubic-bezier(.35,.02,.2,1);
      pointer-events: none;
    }

    .letter-envelope-flap::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 10px 10px 0 0;
      background: #f0dcc1;
      clip-path: polygon(0 0, 100% 0, 50% 68%);
      border-top: 1px solid rgba(121, 87, 58, 0.14);
    }

    .letter-envelope-seal {
      position: absolute;
      z-index: 6;
      left: 50%;
      top: 54%;
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      transform: translate(-50%, -50%) scale(1);
      border-radius: 50%;
      background: #a85e61;
      color: #fff7ee;
      font-size: 18px;
      box-shadow: 0 4px 9px rgba(92, 43, 47, 0.24);
      transition: opacity 220ms ease, transform 220ms ease;
      pointer-events: none;
    }

    .letter-envelope-stage.is-opening .letter-envelope-flap {
      z-index: 2;
      transform: translateY(-67%) scaleY(-1);
    }

    .letter-envelope-stage.is-opening .letter-envelope-seal {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.72);
    }

    .letter-envelope-stage.is-lifting .letter-envelope-preview {
      transform: translateY(-102%) scale(1.04);
    }

    .letter-envelope-stage.is-front .letter-envelope-preview {
      z-index: 8;
    }

    .letter-envelope-stage.is-handoff .letter-envelope-wrap {
      animation: none;
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    .letter-envelope-stage.is-handoff .letter-envelope-back,
    .letter-envelope-stage.is-handoff .letter-envelope-pocket,
    .letter-envelope-stage.is-handoff .letter-envelope-flap {
      opacity: 0;
      transition: opacity 260ms ease;
    }

    .letter-envelope-stage.is-handoff .letter-envelope-preview {
      z-index: 9;
      transform: translateY(-42%) scale(2.3);
      opacity: 0;
      filter: blur(1px);
      transition:
        transform 430ms cubic-bezier(.22,.74,.18,1),
        opacity 330ms ease,
        filter 330ms ease;
    }

    @media (max-width: 480px) {
      .letter-envelope-stage {
        padding: 18px;
      }

      .letter-envelope-wrap {
        width: min(82vw, 330px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .letter-envelope-stage,
      .letter-envelope-wrap,
      .letter-envelope-flap,
      .letter-envelope-preview,
      .letter-envelope-seal {
        animation: none !important;
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  const stage = document.createElement('div');
  stage.className = 'letter-envelope-stage';
  stage.setAttribute('aria-hidden', 'true');
  stage.innerHTML = `
    <div class="letter-envelope-wrap" aria-hidden="true">
      <div class="letter-envelope">
        <div class="letter-envelope-back"></div>
        <div class="letter-envelope-preview"></div>
        <div class="letter-envelope-flap"></div>
        <div class="letter-envelope-pocket"></div>
        <div class="letter-envelope-seal">♥</div>
      </div>
    </div>
  `;
  document.body.appendChild(stage);

  const preview = stage.querySelector('.letter-envelope-preview');
  let playing = false;
  let timers = [];

  function later(fn, delay) {
    const timer = window.setTimeout(fn, delay);
    timers.push(timer);
  }

  function resetStage() {
    timers.forEach(window.clearTimeout);
    timers = [];
    stage.classList.remove('is-active', 'is-opening', 'is-lifting', 'is-front', 'is-handoff');
    stage.setAttribute('aria-hidden', 'true');
    preview.style.backgroundImage = '';
    playing = false;
  }

  function revealLetter(card) {
    if (typeof window.openModal !== 'function') return;
    window.openModal(
      card.dataset.title,
      card.dataset.body,
      card.dataset.paper,
      card.dataset.audio
    );
  }

  function playEnvelope(card) {
    if (playing) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      revealLetter(card);
      return;
    }

    playing = true;
    preview.style.backgroundImage = `url("images/stationery/${card.dataset.paper}")`;
    stage.classList.add('is-active');
    stage.setAttribute('aria-hidden', 'false');

    later(() => stage.classList.add('is-opening'), 760);
    later(() => stage.classList.add('is-lifting'), 1320);
    later(() => stage.classList.add('is-front'), 2070);
    later(() => stage.classList.add('is-handoff'), 2240);
    later(() => {
      revealLetter(card);
      stage.classList.remove('is-active');
      stage.setAttribute('aria-hidden', 'true');
    }, 2550);
    later(resetStage, 2910);
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('.favourite-star')) return;

    const card = event.target.closest(LETTER_SELECTOR);
    if (!card || card.disabled || card.classList.contains('locked')) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    playEnvelope(card);
  }, true);
})();
