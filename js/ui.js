// ui.js - UI updates: tabs, variables display, formatting, clearing

let logEntries = [];
let currentTab = 'variables';

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tab}"]`)?.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(tab)?.classList.add('active');
}

function updateVariablesDisplay() {
    const container = document.getElementById('variables');
    if (!container) return;

    if (Object.keys(variables).length === 0) {
        container.innerHTML = '<div class="placeholder">No variables yet. Run some code!</div>';
        return;
    }

    let html = `<div class="placeholder"><strong>${Object.keys(variables).length} Variables</strong></div>`;
    for (const [name, value] of Object.entries(variables)) {
        html += `
            <div class="var-row">
                <span class="var-name">${name}</span>
                <span class="var-value">${value}</span>
            </div>`;
    }
    container.innerHTML = html;
}

function formatCode() {
    let lines = editor.value.split('\n');
    let indent = 0;
    lines = lines.map(line => {
        let trimmed = line.trim();
        if (trimmed.startsWith('}')) indent = Math.max(0, indent - 1);
        let formatted = '    '.repeat(indent) + trimmed;
        if (trimmed.endsWith('{')) indent++;
        return formatted;
    });
    editor.value = lines.join('\n');
    updateEditorStatus();
}

function clearWorkspace() {
    if (!confirm("Clear current file and console?")) return;
    editor.value = '';
    clearConsole();
    document.getElementById('variables').innerHTML = '<div class="placeholder">Cleared</div>';
    variables = {};
    updateEditorStatus();
}

function updateAutoButton() {
    const btn = document.getElementById('autoBtn');
    if (btn) {
        btn.textContent = `Auto: ${isAutoCompleteOn ? 'ON' : 'OFF'}`;
    }
}
