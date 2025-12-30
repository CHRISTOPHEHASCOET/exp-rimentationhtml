 gsap.registerPlugin(ScrollTrigger);
    const RANDOM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    function setupMobileMenu(){
      const btn = document.getElementById('mobile-menu-button');
      const menu = document.getElementById('mobile-menu');
      if(!btn || !menu) return;
      btn.addEventListener('click', ()=>{
        const hidden = menu.getAttribute('aria-hidden') === 'true';
        menu.style.display = hidden ? 'flex' : 'none';
        menu.setAttribute('aria-hidden', hidden ? 'false' : 'true');
        btn.setAttribute('aria-expanded', hidden ? 'true' : 'false');
      });
    }

    function createTile(char){
      const tile = document.createElement('div');
      tile.className = 'tile';
      const front = document.createElement('div');
      front.className = 'face front';
      front.textContent = (char === ' ' ? ' ' : char);
      const back = document.createElement('div');
      back.className = 'face back';
      back.textContent = (char === ' ' ? ' ' : char);
      tile.appendChild(front);
      tile.appendChild(back);
      return tile;
    }

    function buildTilesForValue(value){
      const wrapper = document.createElement('div');
      wrapper.className = 'cell-tiles';
      for(let i=0;i<value.length;i++){
        const ch = value[i];
        const tile = createTile(ch);
        wrapper.appendChild(tile);
      }
      return wrapper;
    }

    function randomChar(target){
      if(!target) return RANDOM_CHARS[Math.floor(Math.random()*RANDOM_CHARS.length)];
      if(/[0-9]/.test(target)) return String(Math.floor(Math.random()*10));
      if(/[A-Za-z]/.test(target)) return RANDOM_CHARS[Math.floor(Math.random()*RANDOM_CHARS.length)];
      return target;
    }

    function animateRow(row, rowIndex){
      const vol = row.dataset.vol || '';
      const dest = row.dataset.dest || '';
      const stat = row.dataset.stat || '';

      const volCell = buildTilesForValue(vol);
      const destCell = buildTilesForValue(dest);
      const statCell = buildTilesForValue(stat);

      row.innerHTML = '';
      const c1 = document.createElement('div'); c1.appendChild(volCell);
      const c2 = document.createElement('div'); c2.appendChild(destCell);
      const c3 = document.createElement('div'); c3.appendChild(statCell);
      row.appendChild(c1); row.appendChild(c2); row.appendChild(c3);

      const tiles = row.querySelectorAll('.tile');
      const fronts = row.querySelectorAll('.tile .front');
      const backs = row.querySelectorAll('.tile .back');

      const cycles = 5;
      const charDelayBase = 0.01;
      const cycleDuration = 0.12;
      const startDelay = 0.25 + rowIndex * 0.14;

      // randomize characters before flip
      for(let c=0;c<cycles;c++){
        fronts.forEach((f, i) => {
          const finalChar = backs[i] ? backs[i].textContent : '';
          const d = startDelay + c*cycleDuration + i*charDelayBase;
          gsap.to({}, {
            duration: cycleDuration,
            delay: d,
            onStart(){ f.textContent = randomChar(finalChar); }
          });
        });
      }

      const flipStart = startDelay + cycles*cycleDuration + 0.12;
      fronts.forEach((f, i) => {
        const d = flipStart + i * 0.02;
        gsap.to(f, {duration:0.28, rotationX:-90, transformOrigin:'center bottom', ease:'power2.in', delay:d});
      });
      backs.forEach((b, i) => {
        const d = flipStart + i * 0.02;
        gsap.fromTo(b, {rotationX:90}, {rotationX:0, duration:0.28, ease:'power2.out', delay:d});
      });

      setTimeout(()=> {
        backs.forEach(b => b.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-final') || '#E6EEF8');
        gsap.fromTo(backs, {opacity:0.9}, {opacity:1, duration:0.5, ease:'sine.inOut'});
      }, (flipStart + tiles.length*0.02 + 0.3)*1000);
    }

    function buildAndAnimateBoard(){
      const rows = document.querySelectorAll('.board-row:not(.caption-row)');
      rows.forEach((r, i) => {
        setTimeout(()=> animateRow(r, i), i * 160);
      });

      const caption = document.querySelector('.caption-row');
      if(caption) {
        setTimeout(()=> caption.style.opacity = '1', rows.length*160 + 900);
      }
    }

    function openDoorsThenStart(){
      const left = document.querySelector('.door-left');
      const right = document.querySelector('.door-right');
      const overlay = document.querySelector('.door-overlay');
      const board = document.querySelector('.board-inner');

      // small jiggle for life
      gsap.fromTo('.handle-red', {y:-2}, {y:2, duration:0.14, yoyo:true, repeat:4, ease:'sine.inOut'});

      const tl = gsap.timeline({
        onComplete: () => {
          // remove overlay fully
          if(overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
          // reveal board after overlay removed to avoid visual leak
          if(board){
            board.style.visibility = 'visible';
            gsap.to(board, {opacity:1, duration:0.45, ease:'power2.out', onComplete: buildAndAnimateBoard});
          } else {
            buildAndAnimateBoard();
          }
        }
      });

      // move doors out of view (fixed overlay will take them off-screen)
      tl.to(left, {xPercent:-110, duration:0.9, ease:'power4.out'}, 0)
        .to(right, {xPercent:110, duration:0.9, ease:'power4.out'}, 0);
    }

    document.addEventListener('DOMContentLoaded', () => {
      setupMobileMenu();

      // keep overlay visible; board hidden until doors animation completes
      const overlay = document.querySelector('.door-overlay');
      if(overlay) overlay.style.display = 'flex';
      // start open sequence
      setTimeout(openDoorsThenStart, 350);
    });
