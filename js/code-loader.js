document.addEventListener("DOMContentLoaded", function () {
    // Findet alle Tabellen-Boxen auf deiner Webseite
    const codeContainers = document.querySelectorAll("tbody[data-src]");

    codeContainers.forEach(container => {
        const scriptPath = container.getAttribute("data-src");
        if (!scriptPath) return;

        // Lädt deine echte C#-Datei fehlerfrei aus dem Ordner script/
        fetch(scriptPath)
            .then(response => {
                if (!response.ok) throw new Error("Skript konnte nicht geladen werden");
                return response.text();
            })
            .then(text => {
                const lines = text.split(/\r?\n/);

                // Wir leeren den Container zuerst vollständig
                container.innerHTML = "";

                lines.forEach((line, index) => {
                    const lineNumber = index + 1;

                    // 1. Wir erstellen die HTML-Objekte für absolute Sicherheit gegen Text-Müll
                    const row = document.createElement("tr");
                    const numCell = document.createElement("td");
                    const codeCell = document.createElement("td");

                    // 2. Weisen die bekannten CSS-Klassen zu
                    numCell.className = "num";
                    codeCell.className = "code-line";

                    // 3. Nummern-Zelle befüllen
                    numCell.textContent = lineNumber;

                    // 4. UNZERSTÖRBARE FARB-ENGINE (Nativ über Prism)
                    if (window.Prism && Prism.languages.csharp) {
                        /* Prism analysiert den C#-Code im Speicher und baut die Farb-Klassen fehlerfrei zusammen.
                           Es kann NIEMALS wieder 'class=' als Text auf dem Bildschirm erscheinen! */
                        codeCell.innerHTML = Prism.highlight(line, Prism.languages.csharp, 'csharp');
                    } else {
                        // Falls Prism mal nicht geladen ist, bleibt es reiner, sicherer Text
                        codeCell.textContent = line || " ";
                    }

                    // 5. Reihe zusammenbauen und in die Tabelle einfügen
                    row.appendChild(numCell);
                    row.appendChild(codeCell);
                    container.appendChild(row);
                });
            })
            .catch(error => {
                console.error(error);
                container.innerHTML = `<tr><td class="num">!</td><td class="code-line" style="color:red;">Fehler beim Laden des Skripts: ${error.message}</td></tr>`;
            });
    });
});

// Die sichere Kopier-Funktion (Liest nur den reinen Text aus Spalte 2)
function copyCodeToClipboard(targetId, buttonElement) {
    const container = document.getElementById(targetId);
    if (!container || !buttonElement) return;

    const codeLines = container.querySelectorAll('.code-line');
    let textToCopy = "";

    codeLines.forEach((line, index) => {
        textToCopy += line.textContent;
        if (index < codeLines.length - 1) textToCopy += "\n";
    });

    navigator.clipboard.writeText(textToCopy).then(() => {
        buttonElement.textContent = "✓";
        buttonElement.classList.add('copied');
        setTimeout(() => {
            buttonElement.textContent = "❐";
            buttonElement.classList.remove('copied');
        }, 1500);
    });
}

