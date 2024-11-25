const form = document.getElementById('machine-form');
const dataDisplay = document.getElementById('data-display');

let machines = JSON.parse(localStorage.getItem('machines')) || [];

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const machine = {};
    formData.forEach((value, key) => {
        machine[key] = isNaN(value) || key === 'manufacturer' || key === 'machine-name'
            ? value
            : parseFloat(value);
    });
    machines.push(machine);
    localStorage.setItem('machines', JSON.stringify(machines));
    displayMachines();
    form.reset();
});




function displayMachines() {
    dataDisplay.innerHTML = ''; // Alle Einträge löschen
    machines.forEach((machine, index) => {
        const div = document.createElement('div');
        div.className = 'machine';

        // Dynamische Anzeige der Maschinendaten
        for (const [key, value] of Object.entries(machine)) {
            const p = document.createElement('p');
            const readableKey = key
                .replace(/-/g, ' ')
                .replace(/^\w/, (c) => c.toUpperCase()); // Z. B. "machine-number" -> "Machine Number"
            p.textContent = `${readableKey}: ${value}`;
            div.appendChild(p);
        }

        // Löschen-Button hinzufügen
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Löschen';
        deleteButton.addEventListener('click', () => {
            deleteMachine(index);
        });
        div.appendChild(deleteButton);

        dataDisplay.appendChild(div);
    });
}



function deleteMachine(index) {
    machines.splice(index, 1);
    localStorage.setItem('machines', JSON.stringify(machines));
    displayMachines();
}

const downloadButton = document.getElementById('download-data');

downloadButton.addEventListener('click', () => {
    const machines = JSON.parse(localStorage.getItem('machines')) || [];
    const blob = new Blob([JSON.stringify(machines, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'maschinen-daten.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});


// Beim Laden der Seite:
displayMachines();

// Registrierung des Service Workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => {
            console.log('Service Worker erfolgreich registriert.');
        })
        .catch((error) => {
            console.error('Fehler bei der Service Worker Registrierung:', error);
        });
}
