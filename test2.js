document.addEventListener('DOMContentLoaded', () => {

    // --- DONNÉES DE TEST ---
    const flightsData = [
        { flt: 'CH2025', dest: 'PORTFOLIO PILOTE WEB', etd: 'NOW', gate: 'J01', status: 'on-time' },
        { flt: 'BKIT1', dest: 'SITE BOOKI RESA VOYAGE', etd: '09:30', gate: 'C03', status: 'delayed' },
        { flt: 'OMFQ2', dest: 'SITE OHMVFOOD MENUS', etd: '10:45', gate: 'C03', status: 'on-time' },
        { flt: 'PANO3', dest: 'LA PANTHERE REFONTE SEO', etd: '11:30', gate: 'C03', status: 'on-time' },
        { flt: 'CWCO1', dest: 'COOK\'N WAY PLATS MAISON', etd: '12:15', gate: 'D04', status: 'on-time' },
        { flt: 'CAMO2', dest: 'CAMI COURSES EXPRES', etd: '13:00', gate: 'D04', status: 'on-time' },
        { flt: 'FKMO3', dest: 'FKM MOBILITE INCLUSIVE', etd: '13:45', gate: 'D04', status: 'delayed' },
        { flt: 'SKLO1', dest: 'HTML & CSS', etd: 'ALL', gate: 'E05', status: 'on-time' },
        { flt: 'SKLO2', dest: 'JAVASCRIPT', etd: 'ALL', gate: 'E05', status: 'delayed' },
        { flt: 'SKLO3', dest: 'REACT / TS / SASS', etd: 'ALL', gate: 'E05', status: 'on-time' },
    ];

    // --- GÉNÉRATION DU TABLEAU ---
    const tableBody = document.getElementById('flights-table-body');
    tableBody.innerHTML = ''; // Vider avant de remplir

    flightsData.forEach(flight => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="flt">${flight.flt}</td>
            <td class="dest">${flight.dest}</td>
            <td class="etd">${flight.etd}</td>
            <td class="gate">${flight.gate}</td>
            <td class="status ${flight.status}">${flight.status.toUpperCase()}</td>
        `;
        tableBody.appendChild(row);
    });

    // --- MISE À JOUR DE L'HORLOGE ---
    const updateClock = () => {
        const now = new Date();
        document.getElementById('real-time-clock').textContent = formatTime(now);
        document.getElementById('update-time').textContent = formatTime(now);
    };

    const formatTime = (date) => date.toTimeString().split(' ')[0];

    updateClock();
    setInterval(updateClock, 1000); // Mettre à jour l'horloge chaque seconde

});