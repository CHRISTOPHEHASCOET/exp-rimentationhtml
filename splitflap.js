// Mots à mettre en surbrillance (bleu doux)
const HIGHLIGHT_WORDS = ["Bonjour,", "développeur", "web", "mobile", "Je", "combine", "rigueur", "technique", "Imaginatif", "collaboratif,", "navigue"];

// CONSTRUCTION ET ANIMATION FLIPBOARD
function buildSplitFlap() {
  const container = document.getElementById('splitflap');
  if (!container) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Traiter chaque carte de phrase
  container.querySelectorAll('.flap-card').forEach((card, cardIndex) => {
    const text = card.dataset.text.trim().split(/\s+/);
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'flap-card';

    // Créer une pilule par mot
    text.forEach(word => {
      const isHighlighted = HIGHLIGHT_WORDS.includes(word);
      const panelClass = isHighlighted ? 'word-panel highlight' : 'word-panel';

      const panel = document.createElement('div');
      panel.className = panelClass;

      // Face avant (caractère aléatoire)
      const frontFace = document.createElement('div');
      frontFace.className = 'front';
      frontFace.textContent = getRandomChar();

      // Face arrière (mot cible)
      const backFace = document.createElement('div');
      backFace.className = 'back';
      backFace.textContent = word;

      panel.appendChild(frontFace);
      panel.appendChild(backFace);
      cardWrapper.appendChild(panel);
    });

    card.replaceWith(cardWrapper);

    // Animation désactivée si préférence réduite mouvement
    if (reducedMotion) return;

    // ANIMATION FLIP LENTE ET FLUIDE
    gsap.to(cardWrapper.querySelectorAll('.word-panel .front'), {
      rotateX: -90,
      stagger: 0.04,
      duration: 0.4,
      delay: 1 + (cardIndex * 0.3),
      ease: 'power2.inOut'
    });

    gsap.to(cardWrapper.querySelectorAll('.word-panel .back'), {
      rotateX: 0,
      stagger: 0.04,
      duration: 0.4,
      delay: 1 + (cardIndex * 0.3),
      ease: 'power2.inOut'
    });

    // LUEUR SUBTILE SUR MOTS CLÉS
    gsap.to(cardWrapper.querySelectorAll('.highlight .back'), {
      boxShadow: '0 0 12px #A8B6FF60',
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: 'sine.inOut',
      delay: 1.5 + (cardIndex * 0.3)
    });
  });
}

// Générer un caractère aléatoire pour l'effet flip
function getRandomChar() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return chars[Math.floor(Math.random() * chars.length)];
}

// LANCER L'ANIMATION AU CHARGEMENT
window.addEventListener('DOMContentLoaded', buildSplitFlap);