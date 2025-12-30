/* ============================================
   PROFIL.JS — Animations GSAP
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

// ========================================
// 1. TRANSITION D'ENTRÉE
// ========================================
window.addEventListener('load', () => {
    const tlIntro = gsap.timeline();

    tlIntro
        .to('.transition-bar-fill', {
            width: '100%',
            duration: 1.2,
            ease: 'power1.out',
        })
        .to(
            '.page-transition',
            {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out',
                onComplete: () => {
                    const pt = document.querySelector('.page-transition');
                    if (pt) pt.style.display = 'none';
                },
            },
            '-=0.3'
        )
        .from(
            '.hero',
            {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out',
            },
            '-=0.2'
        );
});

// ========================================
// 2. APPARITION DES PANELS AU SCROLL
// ========================================
gsap.utils.toArray('.panel, .cta-bloc').forEach((panel) => {
    gsap.from(panel, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: panel,
            start: 'top 80%',
            once: true,
        },
    });
});

// ========================================
// 3. RADARS — Animation sweep en continu
// ========================================
gsap.to('.radar-sweep', {
    rotation: 360,
    duration: 8,
    repeat: -1,
    ease: 'none',
    transformOrigin: '50% 50%',
});

// ========================================
// 4. CARTES RADAR — Apparition au scroll
// ========================================
gsap.utils.toArray('.radar-card').forEach((card, i) => {
    gsap.from(card, {
        opacity: 0,
        y: 40,
        rotation: i % 2 === 0 ? -3 : 3,
        duration: 0.7,
        delay: i * 0.1,
        ease: 'back.out(1.2)',
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true,
        },
    });
});

// ========================================
// 5. PLAN DE VOL — Avion descent + items
// ========================================
const flightTimeline = document.querySelector('.flight-timeline');
if (flightTimeline) {
    // Avion qui descend
    gsap.fromTo(
        '.plane-icon',
        { top: '0%' },
        {
            top: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: flightTimeline,
                start: 'top center',
                end: 'bottom bottom',
                scrub: 1,
            },
        }
    );

    // Items flight apparition
    gsap.utils.toArray('.flight-item').forEach((item, i) => {
        gsap.from(item, {
            opacity: 0,
            x: -40,
            duration: 0.6,
            delay: i * 0.05,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                once: true,
            },
        });
    });
}

// ========================================
// 6. CARTES FORMATIONS — Flip effect
// ========================================
gsap.utils.toArray('.training-card').forEach((card, i) => {
    gsap.from(card, {
        opacity: 0,
        y: 40,
        rotation: i % 2 === 0 ? -2 : 2,
        duration: 0.7,
        delay: i * 0.08,
        ease: 'back.out(1.1)',
        scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            once: true,
        },
    });
});

// ========================================
// 7. STATISTIQUES — Compteur animé
// ========================================
gsap.utils.toArray('.stat-card').forEach((card, i) => {
    const valueEl = card.querySelector('.stat-value');
    const finalValue = parseInt(valueEl.dataset.value) || 0;
    const isPlus = valueEl.textContent.includes('+');
    
    let obj = { val: 0 };

    gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(obj, {
                    val: finalValue,
                    duration: 1.5,
                    ease: 'power2.out',
                    onUpdate: () => {
                        const v = Math.floor(obj.val);
                        valueEl.textContent = isPlus ? v + '+' : v;
                    },
                });
            },
            once: true,
        },
    });
});

// ========================================
// 8. CTA — Pulse effect au scroll
// ========================================
const ctaPanel = document.querySelector('.cta-bloc');
if (ctaPanel) {
    gsap.from(ctaPanel, {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: ctaPanel,
            start: 'top 80%',
            onEnter: () => {
                // Pulse effect
                gsap.to(ctaPanel, {
                    boxShadow:
                        '0 0 30px rgba(255, 82, 82, 0.4), inset 0 0 30px rgba(255, 82, 82, 0.1)',
                    duration: 1.5,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                });
            },
            once: false,
        },
    });
}

// ========================================
// 9. NAVIGATION ACTIVE AU SCROLL
// ========================================
window.addEventListener('scroll', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    // Déterminer la section visible
    const sections = document.querySelectorAll('section, main');
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id') || section.getAttribute('aria-labelledby');
        }
    });

    // Mettre à jour active class
    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// ========================================
// 10. HOVER EFFECTS — Cards radar items
// ========================================
gsap.utils.toArray('.radar-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
        gsap.to(item, {
            x: 4,
            duration: 0.2,
            overwrite: 'auto',
        });
    });

    item.addEventListener('mouseleave', () => {
        gsap.to(item, {
            x: 0,
            duration: 0.2,
            overwrite: 'auto',
        });
    });
});

// ========================================
// 11. ACCESSIBILITY — Focus visible
// ========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

console.log('🎬 Animations GSAP activées — Vol CH-2025 en cours...');