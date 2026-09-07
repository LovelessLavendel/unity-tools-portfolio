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
                // Wir leeren den Container zuerst vollständig
                container.innerHTML = "";

                let highlightedHTML = "";

                // 1. DER GANZE BLOCK AUF EINMAL: Prism analysiert das komplette Skript im Speicher
                if (window.Prism && Prism.languages.csharp) {
                    highlightedHTML = Prism.highlight(text, Prism.languages.csharp, 'csharp');
                } else {
                    // Fallback, falls Prism nicht bereit ist
                    highlightedHTML = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                }

                // 2. ZEILEN TRENNEN: Wir splitten das fertig gefärbte HTML an den Zeilenumbrüchen
                const lines = highlightedHTML.split(/\r?\n/);

                // 3. TABELLE BAUEN: Jede Zeile sauber in ein <tr> einbetten
                lines.forEach((lineContent, index) => {
                    const lineNumber = index + 1;

                    const row = document.createElement("tr");
                    const numCell = document.createElement("td");
                    const codeCell = document.createElement("td");

                    // Weisen die bekannten CSS-Klassen zu
                    numCell.className = "num";
                    codeCell.className = "code-line";

                    // Nummern-Zelle befüllen
                    numCell.textContent = lineNumber;

                    // Code-Inhalt einfügen (Falls die Zeile komplett leer ist, ein Leerzeichen für das Layout)
                    codeCell.innerHTML = lineContent || " ";

                    // Reihe zusammenbauen und in die Tabelle einfügen
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

// Die absolut sichere Kopier-Funktion für Unity/Windows Visual Studio
function copyCodeToClipboard(targetId, buttonElement) {
    const container = document.getElementById(targetId);
    if (!container || !buttonElement) return;

    const codeLines = container.querySelectorAll('.code-line');
    let textToCopy = "";

    codeLines.forEach((line, index) => {
        // Holt den reinen Text der Zeile (entfernt die HTML-Klassen beim Kopieren automatisch)
        let currentLine = line.textContent;

        // Verhindert, dass leere Zeilen komplett verschwinden
        if (currentLine === "") currentLine = " ";

        textToCopy += currentLine;

        // Nutzt \r\n (Windows Standard), damit Visual Studio keine "Inkonsistente Zeilenenden" Warnung wirft
        if (index < codeLines.length - 1) {
            textToCopy += "\r\n";
        }
    });

    // Schreibt den perfekt formatierten Text in die Zwischenablage
    navigator.clipboard.writeText(textToCopy).then(() => {
        buttonElement.textContent = "✓";
        buttonElement.classList.add('copied');
        setTimeout(() => {
            buttonElement.textContent = "❐";
            buttonElement.classList.remove('copied');
        }, 1500);
    }).catch(err => {
        console.error("Kopieren fehlgeschlagen: ", err);
    });
}
