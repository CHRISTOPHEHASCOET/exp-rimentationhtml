// gsap-anim.js - flipboard animation (letter-by-letter, random cycles -> final reveal)
gsap.registerPlugin(ScrollTrigger);

/*
 Behavior:
  - Build tiles per character for each .flipboard-row
  - When invoked (after doors opened), run randomization cycles for each tile
  - After cycles, animate flip (front rotateX -> -90; back rotateX -> 0)
  - Use colors: front (random) = var(--text-random), back (final) = var(--text)
*/

(function(){
  // exposed init function invoked by main.js after doors open
  window.gsapFlipboardInit = function(){
    // respect reduced motion
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      revealWithoutAnimation();
      return;
    }
    buildTiles();
    startRandomAndFlip();
  };

  // helper: generate a random character similar category to target
  function randomCharFor(target){
    if(!target) return '-';
    if(/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(target)){
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      return chars.charAt(Math.floor(Math.random()*chars.length));
    }
    if(/\d/.test(target)) return String(Math.floor(Math.random()*10));
    // punctuation/space keep as is or use a dash
    return target === ' ' ? '\u00A0' : target;
  }

  // Build tiles DOM
  function buildTiles(){
    const rows = document.querySelectorAll('.flipboard-row');
    rows.forEach(row => {
      const text = row.dataset.text || '';
      // create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'flipboard-row'; // same class to keep layout
      wrapper.setAttribute('aria-hidden','false');

      // for each character create tile
      Array.from(text).forEach(ch => {
        const tile = document.createElement('div');
        tile.className = 'tile';

        const front = document.createElement('div');
        front.className = 'front';
        front.textContent = randomCharFor(ch); // initial random

        const back = document.createElement('div');
        back.className = 'back';
        back.textContent = ch === ' ' ? '\u00A0' : ch;

        // set transform baseline
        front.style.transform = 'rotateX(0deg)';
        back.style.transform = 'rotateX(90deg)';

        tile.appendChild(front);
        tile.appendChild(back);
        wrapper.appendChild(tile);
      });

      row.parentNode.replaceChild(wrapper, row);
    });
  }

  // Start randomization cycles then flip
  function startRandomAndFlip(){
    const rows = document.querySelectorAll('.flipboard-row');

    rows.forEach((row, rowIndex) => {
      const tiles = Array.from(row.querySelectorAll('.tile'));
      const cycles = 5;              // number of random cycles
      const cycleInterval = 75;      // ms between random char updates (fast)
      const staggerDelay = 18;       // stagger when flipping (ms)
      let completedTiles = 0;

      // For each tile, run short randomization then flip it in a staggered wave
      tiles.forEach((tile, i) => {
        const front = tile.querySelector('.front');
        const back = tile.querySelector('.back');
        const targetChar = back.textContent;

        // randomizer: change front content cycles times
        let iter = 0;
        const rndTimer = setInterval(() => {
          front.textContent = randomCharFor(targetChar);
          iter++;
          if(iter >= cycles){
            clearInterval(rndTimer);
            // small delay per tile to create wave -> then flip
            setTimeout(() => {
              // animate flip: front rotates up, back rotates to place
              gsap.to(front, { rotationX: -90, duration: 0.28, ease: 'power2.in' });
              gsap.to(back, { rotationX: 0, duration: 0.28, ease: 'power2.out', onComplete: () => {
                completedTiles++;
                // after all tiles complete in the row, optionally run a small highlight
                if(completedTiles === tiles.length){
                  gsap.fromTo(row, { boxShadow: '0 0 0 rgba(255,59,59,0)' }, { boxShadow: '0 18px 46px rgba(0,0,0,0.45)', duration:0.45, delay:0.05, yoyo:true, repeat:0 });
                }
              }});
              // ensure front hidden at end
              setTimeout(()=> { front.style.visibility = 'hidden'; }, 280);
            }, i * staggerDelay + rowIndex * 30);
          }
        }, cycleInterval);
      });
    });
  }

  // Reduced motion fallback: write final text plainly (no animation)
  function revealWithoutAnimation(){
    const rows = document.querySelectorAll('.flipboard-row');
    rows.forEach(row => {
      const text = row.dataset.text || '';
      row.textContent = text;
    });
    // hide doors if present
    const overlay = document.querySelector('.door-overlay');
    if(overlay) overlay.style.display = 'none';
  }

  // Auto-init if doors were already removed or in dev
  document.addEventListener('DOMContentLoaded', () => {
    // if overlay is not present or already hidden, start immediately
    const overlay = document.querySelector('.door-overlay');
    if(!overlay) {
      setTimeout(() => window.gsapFlipboardInit && window.gsapFlipboardInit(), 120);
    }
  });

})();
