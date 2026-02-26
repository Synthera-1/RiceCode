// ui.js - UI updates, tabs, logs, variables display

let logEntries = [];
let currentTab = 'variables';

function toggleAutoComplete() {
    isAutoCompleteOn = !isAutoCompleteOn;
    document.getElementById('autoBtn').textContent = `🧠 Auto: ${isAutoCompleteOn ? 'ON' : 'OFF'}`;
    document.getElementById('autoBtn').style.background = isAutoCompleteOn
        ? 'linear-gradient(135deg, #6e40c9, #8b5cf6)'
        : 'linear-gradient(135deg, #555, #777)';
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
}

function updateVariablesTab() {
    const container = document.getElementById('variables');
    if (Object.keys(variables).length === 0) {
        container.innerHTML = `<div class="placeholder">No variables yet. Run some code!</div>`;
        return;
    }
    let html = `<div class="placeholder"><strong>${Object.keys(variables).length} Variables</strong></div>`;
    for (const [name, value] of Object.entries(variables)) {
        html += `<div class="var-row"><span class="var-name">${name}</span><span class="var-value">${value}</span></div>`;
    }
    container.innerHTML = html;
}

function addLog(message) {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    logEntries.push(`${time} ${message}`);
    if (currentTab === 'logs') {
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.textContent = logEntries[logEntries.length - 1];
        document.getElementById('logs').appendChild(div);
        document.getElementById('logs').scrollTop = document.getElementById('logs').scrollHeight;
    }
}

function runCode() {
    const runBtn = document.getElementById('runBtn');
    const consoleDiv = document.getElementById('console');
    runBtn.classList.add('active');
    consoleDiv.innerHTML = '<span class="success">🔄 Running simulation...</span>';

    setTimeout(() => {
        try {
            const output = parseAndExecute(editor.value);
            consoleDiv.innerHTML = output.length > 0
                ? output.map(line => `<div>${line}</div>`).join('')
                : '<span class="warn">No output (System.out) found</span>';

            updateVariablesTab();
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
        } catch (err) {
            consoleDiv.innerHTML = `<span class="error">Error: ${err.message}</span>`;
        }
        runBtn.classList.remove('active');
    }, 300);
}

function formatCode() {
    let lines = editor.value.split('\n');
    let indent = 0;
    lines = lines.map(line => {
        let t = line.trim();
        if (t.startsWith('}')) indent = Math.max(0, indent - 1);
        let formatted = '    '.repeat(indent) + t;
        if (t.endsWith('{')) indent++;
        return formatted;
    });
    editor.value = lines.join('\n');
    updateStatus();
}

function clearAll() {
    editor.value = '';
    document.getElementById('console').innerHTML = '<span class="success">Cleared</span>';
    document.getElementById('variables').innerHTML = '<div class="placeholder">Cleared</div>';
    document.getElementById('logs').innerHTML = '<div class="placeholder">Logs cleared</div>';
    variables = {};
    logEntries = [];
    updateStatus();
}

function updateAutoButton() {
    document.getElementById('autoBtn').textContent = `🧠 Auto: ${isAutoCompleteOn ? 'ON' : 'OFF'}`;
}
