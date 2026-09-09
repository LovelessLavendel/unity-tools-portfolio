document.addEventListener("DOMContentLoaded", function () {
    const codeContainers = document.querySelectorAll("tbody[data-src]");

    codeContainers.forEach(container => {
        const scriptPath = container.getAttribute("data-src");
        if (!scriptPath) return;

        fetch(scriptPath)
            .then(response => {
                if (!response.ok) throw new Error("Skript konnte nicht geladen werden");
                return response.text();
            })
            .then(text => {
                container.innerHTML = "";

                let highlightedHtml = "";

                // 1. Den gesamten Textblock auf einmal einfärben
                if (window.Prism && Prism.languages && Prism.languages.csharp) {
                    highlightedHtml = Prism.highlight(text, Prism.languages.csharp, 'csharp');
                } else {
                    highlightedHtml = escapeHtml(text);
                }

                // 2. Das generierte HTML sauber in Zeilen splitten
                const lines = highlightedHtml.split(/\r?\n/);

                lines.forEach((lineHtml, index) => {
                    const lineNumber = index + 1;

                    const row = document.createElement("tr");
                    const numCell = document.createElement("td");
                    const codeCell = document.createElement("td");

                    numCell.className = "num";
                    codeCell.className = "code-line";
                    numCell.textContent = lineNumber;

                    // 3. WICHTIG: innerHTML verwenden, damit die von Prism erzeugten <span>-Farb-Tags wirken
                    // Falls die Zeile leer ist, erzwingen wir ein Leerzeichen für die korrekte Zeilenhöhe
                    codeCell.innerHTML = lineHtml.trim() === "" ? " " : lineHtml;

                    row.appendChild(numCell);
                    row.appendChild(codeCell);
                    container.appendChild(row);
                });
            })
            .catch(error => {
                console.error(error);
                container.innerHTML = `<tr><td class="num">!</td><td class="code-line" style="color:red;">Fehler beim Laden der Datei: ${error.message}</td></tr>`;
            });
    });
});

// Sicheres Fallback-Escaping
function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Clipboard-Kopierfunktion (bereits optimiert für reinen Text)
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
