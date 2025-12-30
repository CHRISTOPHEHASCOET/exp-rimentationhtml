document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const ALPHABET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:&-";
    const FLIP_DURATION = 0.15; // Vitesse de chaque flip
    const FLIP_SOUND = document.getElementById('flip-sound');

    const flightsData = [
        "FLT  DESTINATION              ETD    GATE  STATUS", // Header
        "-------------------------------------------------------",
        "CH2025 PORTFOLIO PILOTE WEB     NOW    J01   EMBARQUEMENT",
        "BKIT1  SITE BOOKI RESA VOYAGE  09:30  C03   PROJET DEV",
        "OMFQ2  SITE OHMYFOOD MENUS     10:45  C03   PROJET DEV",
        "CWCO1  COOK N WAY PLATS MAISON 12:15  D04   CAHIER",
        "SKLO1  HTML CSS SASS           ALL    E05   COMPETENCES",
        "SKLO2  JAVASCRIPT TS REACT     ALL    E06   APPRENTISSAGE",
    ];

    const board = document.getElementById('departures-board');
    const preloader = document.getElementById('gate-preloader');
    
    // --- FONCTIONS DU MÉCANISME ---

    /** Crée la structure HTML pour un seul volet de caractère */
    function createFlap(char) {
        const flap = document.createElement('div');
        flap.className = 'split-flap';
        flap.innerHTML = `
            <div class="flap top"><div class="text">${char}</div></div>
            <div class="flap bottom"><div class="text">${char}</div></div>
            <div class="flipper">
                <div class="flap top"><div class="text">${char}</div></div>
                <div class="flap bottom"><div class="text">${char}</div></div>
            </div>
        `;
        // Stocker les éléments pour un accès rapide
        flap.nodes = {
            currentTop: flap.querySelector('.top .text'),
            currentBottom: flap.querySelector('.bottom .text'),
            flipper: flap.querySelector('.flipper'),
            flipperTop: flap.querySelector('.flipper .top .text'),
            flipperBottom: flap.querySelector('.flipper .bottom .text'),
        };
        return flap;
    }

    /** Anime un seul volet pour atteindre un caractère cible */
    function animateFlap(flap, targetChar) {
        const currentCharl = flap.nodes.currentTop.textContent;
        if (currentCharl === targetChar) return;

        let currentIndex = ALPHABET.indexOf(currentCharl);
        const targetIndex = ALPHABET.indexOf(targetChar);
        if (currentIndex === -1 || targetIndex === -1) return;

        const timeline = gsap.timeline();
        
        // Boucle de l'index actuel à l'index cible
        while(currentIndex !== targetIndex) {
            const nextIndex = (currentIndex + 1) % ALPHABET.length;
            const currentChar = ALPHABET[currentIndex];
            const nextChar = ALPHABET[nextIndex];
            
            timeline.set(flap.nodes.flipper, { rotationX: 0 });
            timeline.set(flap.nodes.flipperTop, { textContent: nextChar });
            timeline.set(flap.nodes.flipperBottom, { textContent: currentChar });
            timeline.set(flap.nodes.currentTop, { textContent: nextChar });

            timeline.to(flap.nodes.flipper, { 
                rotationX: -180, 
                duration: FLIP_DURATION,
                ease: 'power1.in',
                onStart: () => {
                    FLIP_SOUND.currentTime = 0;
                    FLIP_SOUND.play();
                }
            });

            timeline.set(flap.nodes.currentBottom, { textContent: nextChar });
            currentIndex = nextIndex;
        }
        return timeline;
    }

    // --- INITIALISATION DU TABLEAU ---
    function initBoard() {
        // 1. Crée la grille de volets
        const allFlaps = [];
        flightsData.forEach(lineText => {
            const row = document.createElement('div');
            row.className = 'row';
            const flapsInRow = [];
            for (const char of lineText) {
                const flap = createFlap(' ');
                row.appendChild(flap);
                flapsInRow.push(flap);
            }
            board.appendChild(row);
            allFlaps.push(...flapsInRow);
        });

        // 2. Anime les volets vers leur état final
        const masterTimeline = gsap.timeline({ delay: 0.5 });
        const allTargetText = flightsData.join('');

        allFlaps.forEach((flap, i) => {
            const targetChar = allTargetText[i] || ' ';
            const flapTimeline = animateFlap(flap, targetChar);
            if(flapTimeline) {
                masterTimeline.add(flapTimeline, Math.random() * 2); // Décalage aléatoire pour un effet plus naturel
            }
        });
    }

    // --- SÉQUENCE DE DÉMARRAGE ---
    function startSequence() {
        gsap.timeline({
            onComplete: () => preloader.style.display = 'none'
        })
        .to('.gate-label', { opacity: 0, duration: 0.5, ease: 'power2.in' })
        .to('.left-door', { x: '-100%', duration: 1.2, ease: 'power3.inOut' }, 'open')
        .to('.right-door', { x: '100%', duration: 1.2, ease: 'power3.inOut' }, 'open')
        .set('.board-container', { visibility: 'visible' })
        .add(initBoard);
    }

    // Lance le tout au chargement de la page
    window.onload = () => {
        //setTimeout(startSequence, 500); // Petit délai pour que tout charge bien
        startSequence();
    };
});