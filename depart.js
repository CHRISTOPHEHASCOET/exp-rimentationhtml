const fidsData = [
    { vol: "CH-001", dest: "HTML5 / CSS3", type: "Langage", stat: "EN REPRISE", gate: "A01", obs: "PROFIL / COCKPIT" },
    { vol: "CH-BK01", dest: "BOOKI", type: "Projet", stat: "EN VOL", gate: "E12", obs: "ZONE D’EMBARQUEMENT" },
    { vol: "CH-CAS1", dest: "REFONTE SITE VITRINE", type: "Étude de cas", stat: "EN PRÉPARATION", gate: "V03", obs: "PLAN DE VOL" }
];

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('fids-body');
    if (!container) return;

    fidsData.forEach((data, rowIndex) => {
        const row = document.createElement('div');
        row.className = 'fids-row';

        // Colonne VOL
        row.innerHTML += `<div class="cell mono">${data.vol}</div>`;
        // Colonne DESTINATION
        row.innerHTML += `<div class="cell bold">${data.dest}</div>`;
        // Colonne TYPE
        row.innerHTML += `<div class="cell">${data.type}</div>`;
        // Colonne STATUT (Pill style)
        const statClass = data.stat === "EN VOL" ? "stat-vol" : (data.stat === "EN REPRISE" ? "stat-rep" : "stat-pre");
        row.innerHTML += `<div class="cell"><span class="status-pill ${statClass}">${data.stat}</span></div>`;
        // Colonne PORTE
        row.innerHTML += `<div class="cell mono">${data.gate}</div>`;
        // Colonne OBSERVATION
        row.innerHTML += `<div class="cell"><span class="obs-pill">${data.obs}</span></div>`;

        container.appendChild(row);
    });

    // Heure locale dynamique
    setInterval(() => {
        const now = new Date();
        document.getElementById('local-time').innerText = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    }, 1000);
});