// main.js ─ Core orchestration, file management, input handling

let currentFile = "Main.java";
const files = {
    "Main.java": `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Enter your name: ");
        String name = sc.nextLine();
        
        System.out.print("Enter your age: ");
        int age = sc.nextInt();
        
        System.out.println("\\nHello, " + name + "!");
        System.out.println("You are " + age + " years old.");
    }
}`
};

let isAutoCompleteOn = true;
let pendingInputResolver = null;

const editor = document.getElementById('editor');

document.addEventListener('DOMContentLoaded', () => {
    editor.value = files[currentFile];
    updateEditorStatus();
    renderFileTabs();
    updateVariablesDisplay();

    // Event listeners
    document.getElementById('runBtn').onclick = runCode;
    document.getElementById('formatBtn').onclick = formatCode;
    document.getElementById('clearBtn').onclick = clearWorkspace;
    document.getElementById('addFileBtn').onclick = createNewFile;

    document.querySelectorAll('.tab').forEach(tab => {
        tab.onclick = () => switchTab(tab.dataset.tab);
    });

    document.getElementById('file-tabs').onclick = e => {
        if (e.target.classList.contains('file-tab')) {
            switchFile(e.target.dataset.file);
        }
    };

    // Input handling
    const inputEl = document.getElementById('console-input');
    document.getElementById('submit-input').onclick = submitInput;
    inputEl.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); submitInput(); } };
});

async function runCode() {
    const btn = document.getElementById('runBtn');
    const status = document.getElementById('execution-status');
    btn.disabled = true;
    status.textContent = 'Executing...';
    clearConsole();

    try {
        files[currentFile] = editor.value;
        await parseAndExecute(editor.value);
        status.textContent = 'Execution finished';
    } catch (err) {
        appendConsole(`Error: ${err.message}`, 'error');
        status.textContent = 'Error';
    } finally {
        btn.disabled = false;
    }
}

function createNewFile() {
    let name = prompt("New file name (with .java extension)", "Untitled.java");
    if (!name) return;
    if (files[name]) {
        alert("File already exists.");
        return;
    }
    files[name] = `public class ${name.replace('.java','')} {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`;
    renderFileTabs();
    switchFile(name);
}

function renderFileTabs() {
    const container = document.getElementById('file-tabs');
    container.innerHTML = '';
    Object.keys(files).forEach(name => {
        const tab = document.createElement('button');
        tab.className = 'file-tab' + (name === currentFile ? ' active' : '');
        tab.dataset.file = name;
        tab.textContent = name;
        container.appendChild(tab);
    });
}

function switchFile(name) {
    if (currentFile === name) return;
    files[currentFile] = editor.value;
    currentFile = name;
    editor.value = files[name] || '';
    updateEditorStatus();
    renderFileTabs();
}

function submitInput() {
    if (!pendingInputResolver) return;
    const value = document.getElementById('console-input').value.trim();
    appendConsole(value, 'prompt');
    pendingInputResolver(value);
    pendingInputResolver = null;
    document.getElementById('console-input').value = '';
    document.getElementById('console-input-area').classList.add('hidden');
}

function clearConsole() {
    document.getElementById('console-output').innerHTML = '';
}
