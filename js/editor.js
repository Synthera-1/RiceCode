// editor.js - Auto-complete, status bar updates

const editor = document.getElementById('editor');

if (editor) {
    editor.addEventListener('keydown', e => {
        if (!isAutoCompleteOn) return;
        if (e.ctrlKey || e.metaKey) return;

        const start = editor.selectionStart;
        const after = editor.value.slice(editor.selectionEnd);

        switch (e.key) {
            case '(': if (!after.startsWith(')')) { e.preventDefault(); insertPair('()', 1); } break;
            case '{': if (!after.startsWith('}')) { e.preventDefault(); insertPair('{}', 1); } break;
            case '[': if (!after.startsWith(']')) { e.preventDefault(); insertPair('[]', 1); } break;
            case '"': if (!after.startsWith('"')) { e.preventDefault(); insertPair('""', 1); } break;
            case 'Tab':
                e.preventDefault();
                insertText('    ');
                break;
        }
    });

    editor.addEventListener('input', updateEditorStatus);
    editor.addEventListener('mouseup', updateEditorStatus);
    editor.addEventListener('keyup', updateEditorStatus);
}

function insertPair(pair, pos) {
    const start = editor.selectionStart;
    editor.value = editor.value.slice(0, start) + pair + editor.value.slice(editor.selectionEnd);
    editor.setSelectionRange(start + pos, start + pos);
    editor.dispatchEvent(new Event('input'));
}

function insertText(text) {
    const start = editor.selectionStart;
    editor.value = editor.value.slice(0, start) + text + editor.value.slice(editor.selectionEnd);
    editor.setSelectionRange(start + text.length, start + text.length);
    editor.dispatchEvent(new Event('input'));
}

function updateEditorStatus() {
    const pos = editor.selectionStart;
    const lines = editor.value.slice(0, pos).split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.textContent = `Ln ${line}, Col ${col} | Pro IDE`;
    }
}
