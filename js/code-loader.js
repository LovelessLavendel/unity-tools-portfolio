document.addEventListener("DOMContentLoaded", function () {
    const codeContainers = document.querySelectorAll("tbody[data-src]");

    codeContainers.forEach(container => {
        const scriptPath = container.getAttribute("data-src");
        if (!scriptPath) return;

        fetch(scriptPath)
            .then(response => {
                if (!response.ok) throw new Error("Skriptdatei wurde im Ordner nicht gefunden.");
                return response.text();
            })
            .then(text => {
                container.innerHTML = "";
                let highlightedHTML = "";

                if (window.Prism && Prism.languages.csharp) {
                    highlightedHTML = Prism.highlight(text, Prism.languages.csharp, 'csharp');
                } else {
                    highlightedHTML = text;
                }

                const lines = highlightedHTML.split(/\r?\n/);

                lines.forEach((lineContent, index) => {
                    const row = document.createElement("tr");
                    const numCell = document.createElement("td");
                    const codeCell = document.createElement("td");

                    numCell.className = "num";
                    codeCell.className = "code-line";
                    numCell.textContent = index + 1;
                    codeCell.innerHTML = lineContent || " ";

                    row.appendChild(numCell);
                    row.appendChild(codeCell);
                    container.appendChild(row);
                });
            })
            .catch(error => {
                console.error(error);
                container.innerHTML = "<tr><td class='num'>!</td><td class='code-line' style='color:red;'>Fehler: " + error.message + "</td></tr>";
            });
    });
});

function copyCodeToClipboard(targetId, buttonElement) {
    const container = document.getElementById(targetId);
    if (!container || !buttonElement) return;

    const codeLines = container.querySelectorAll('.code-line');
    let textToCopy = "";

    codeLines.forEach((line, index) => {
        let currentLine = line.textContent;
        if (currentLine === "") currentLine = " ";
        textToCopy += currentLine;
        if (index < codeLines.length - 1) {
            textToCopy += "\r\n";
        }
    });

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
