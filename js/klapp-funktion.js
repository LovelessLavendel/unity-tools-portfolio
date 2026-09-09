function toggleCode(blockId) {
    const block = document.getElementById(blockId);
    const btn = block.querySelector('.toggle-code-btn');

    if (block.classList.contains('collapsed')) {
        block.classList.remove('collapsed');
        btn.innerText = '▲ Weniger anzeigen (Code einklappen)';
    } else {
        block.classList.add('collapsed');
        btn.innerText = '▼ Mehr anzeigen (vollständigen Code ausklappen)';
        // Scrollt den Nutzer sanft zurück nach oben zum Start des jeweiligen Skripts
        block.scrollIntoView({ behavior: 'smooth' });
    }
}