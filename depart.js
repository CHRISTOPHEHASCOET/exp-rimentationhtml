// ============================================
// ACCUEIL.JS - ANIMATIONS TABLEAU DES DÉPARTS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // ANIMATION HORLOGE
    // ============================================
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('current-time').textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // Mettre à jour l'heure toutes les secondes
    updateClock();
    setInterval(updateClock, 1000);
    
    // ============================================
    // ANIMATION SPLIT-FLAP
    // ============================================
    const boardRows = document.querySelectorAll('.board-row');
    
    if (boardRows.length > 0) {
        boardRows.forEach((row, index) => {
            // Initialiser la position de départ
            gsap.set(row, { opacity: 0, y: 50 });
            
            // Animer l'apparition
            gsap.to(row, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: index * 0.1,
                ease: "power2.out"
            });
        });
    }
    
    // ============================================
    // ANIMATION DES LETTRES
    // ============================================
    const departureTitle = document.querySelector('.departure-title');
    if (departureTitle) {
        const text = departureTitle.textContent;
        const spannedText = text.split('').map((char, i) => {
            return `<span style="display:inline-block; animation-delay:${i * 0.05}s">${char}</span>`;
        }).join('');
        
        departureTitle.innerHTML = spannedText;
    }
    
    // ============================================
    // ANIMATION DES LIGNES DE SÉPARATION
    // ============================================
    const boardHeaders = document.querySelector('.board-headers');
    if (boardHeaders) {
        const headerCells = boardHeaders.querySelectorAll('.board-header-item');
        headerCells.forEach((cell, index) => {
            gsap.from(cell, {
                y: -20,
                opacity: 0,
                duration: 0.6,
                delay: index * 0.1,
                ease: "power2.out"
            });
        });
    }
    
    // ============================================
    // ANIMATION DES CELLULES
    // ============================================
    const boardCells = document.querySelectorAll('.board-cell');
    if (boardCells.length > 0) {
        boardCells.forEach((cell, index) => {
            gsap.from(cell, {
                scale: 0.8,
                opacity: 0,
                duration: 0.5,
                delay: index * 0.02,
                ease: "back.out(1.7)"
            });
        });
    }
    
});