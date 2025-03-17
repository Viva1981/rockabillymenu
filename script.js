document.addEventListener("DOMContentLoaded", function () {
    gapi.load("client", function () {
        gapi.client.init({
            apiKey: 'AIzaSyC28fhiSrVfGENLAttslI8hlaoaiJ0Vkf0',
            discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
        }).then(function () {
            console.log("Google Sheets API betöltve!");
            loadSheetData();
            setInterval(loadSheetData, 30000); // 30 másodpercenként frissítés
        }).catch(function (error) {
            console.error("Hiba az API inicializálásában:", error);
            document.querySelector('.loading').textContent = "❌ API inicializációs hiba!";
        });
    });

    function loadSheetData() {
        console.log("Adatok frissítése...");

        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1foZFKF-cWas9WeBns-0i-ojsdDgGo1eRHpjaKIeFlRg',
            range: 'A1:Z100'
        }).then(function (response) {
            const data = response.result.values;
            if (!data || data.length === 0) {
                document.querySelector('.loading').textContent = "⚠️ Nincsenek adatok!";
                return;
            }

            const tableHeader = document.getElementById("table-header");
            const tableBody = document.getElementById("table-body");
            const loadingText = document.querySelector(".loading");
            const table = document.getElementById("data-table");

            loadingText.style.display = "none";
            table.style.display = "table";

            // Fejléc létrehozása
            tableHeader.innerHTML = "";
            data[0].forEach(header => {
                const th = document.createElement("th");
                th.textContent = header;
                tableHeader.appendChild(th);
            });

            // Sorok létrehozása
            tableBody.innerHTML = "";
            data.slice(1).forEach(row => { // Kezdjük a második sortól
                const tr = document.createElement("tr");

                row.forEach(cell => {
                    const td = document.createElement("td");

                    // Feltételes formázás meghatározott szövegekhez
                    if (
                        cell.includes("Leves + Második") || 
                        cell.includes("CSAK LEVES (1.150 Ft)") || 
                        cell.includes("CSAK MÁSODIK (2.300 Ft)")
                    ) {
                        td.classList.add("small-gray-text"); // Szürke és kisebb szöveg formázása
                    }

                    // Ellenőrizzük, hogy a cella URL-e
                    if (isValidURL(cell)) {
                        const a = document.createElement("a");
                        a.href = cell;
                        a.textContent = "🔗 Link megnyitása";
                        a.target = "_blank"; // Új lapon nyíljon meg
                        a.rel = "noopener noreferrer"; // Biztonsági okokból
                        td.appendChild(a);
                    } else {
                        td.textContent = cell;
                    }

                    tr.appendChild(td);
                });

                tableBody.appendChild(tr);
            });

            console.log("Adatok sikeresen frissítve!");

        }).catch(function (error) {
            console.error("Hiba az adatok betöltésekor:", error);
            document.querySelector('.loading').textContent = "❌ Hiba történt!";
        });
    }

    // Segédfüggvény URL-ek felismerésére
    function isValidURL(str) {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    }
});
