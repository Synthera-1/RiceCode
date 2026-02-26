// simulator.js - Java code simulation engine

let variables = {};

function safeEvaluate(expr, vars) {
    try {
        const ctx = { ...vars, Math };
        const keys = Object.keys(ctx);
        const values = Object.values(ctx);
        let jsExpr = expr.trim()
            .replace(/;$/, '')
            .replace(/\btrue\b/g, 'true')
            .replace(/\bfalse\b/g, 'false');
        const fn = new Function(...keys, `"use strict"; return (${jsExpr});`);
        let result = fn(...values);
        if (typeof result === 'boolean') return result ? 'true' : 'false';
        if (typeof result === 'number') return Number.isInteger(result) ? result : result.toFixed(4).replace(/\.?0+$/, '');
        return String(result);
    } catch (e) {
        return `<<error: ${e.message}>>`;
    }
}

function extractMainBody(code) {
    const match = code.match(/public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*args\s*\)\s*\{([\s\S]*?)\}(?:\s*\}|$)/i);
    return match ? match[1] : code;
}

async function parseAndExecute(code) {
    variables = {};
    clearConsole();

    const mainBody = extractMainBody(code);
    const clean = mainBody
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');
    const statements = clean.split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    appendConsole("Simulation started...", 'system');

    for (let stmt of statements) {
        // Scanner declaration
        if (stmt.match(/Scanner\s+(\w+)\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)/i)) {
            appendConsole("Scanner initialized", 'system');
            continue;
        }

        // Input calls
        const scannerCall = stmt.match(/^(\w+)\s*=\s*(\w+)\.(nextLine|nextInt|nextDouble|next|nextBoolean)\s*\(\s*\)$/i);
        if (scannerCall) {
            const [, varName, , method] = scannerCall;
            appendConsole(`Input required (${method})...`, 'system');

            const userInput = await waitForUserInput();

            let value;
            if (method.toLowerCase() === 'nextint') value = parseInt(userInput) || 0;
            else if (method.toLowerCase() === 'nextdouble') value = parseFloat(userInput) || 0;
            else if (method.toLowerCase() === 'nextboolean') value = userInput.toLowerCase() === 'true' || userInput.toLowerCase() === 'yes';
            else value = userInput;

            variables[varName] = value;
            appendConsole(`→ ${varName} = ${value}`, 'system');
            continue;
        }

        // Print / Println
        const printMatch = stmt.match(/^System\.out\.print(ln)?\s*\(\s*(.+)\s*\)$/i);
        if (printMatch) {
            const arg = printMatch[2].trim();
            const result = safeEvaluate(arg, variables);
            appendConsole(result, 'output');
            continue;
        }

        // Declaration with initializer
        const decl = stmt.match(/^(int|double|float|long|String|boolean|char|var)\s+(\w+)\s*=\s*(.+)$/i);
        if (decl) {
            const [, , name, expr] = decl;
            variables[name] = safeEvaluate(expr, variables);
            continue;
        }

        // Bare declaration
        const bare = stmt.match(/^(int|double|float|long|String|boolean|char|var)\s+(\w+)$/i);
        if (bare) {
            const [, type, name] = bare;
            variables[name] = type.toLowerCase() === 'string' ? '' : 0;
            continue;
        }

        // Assignment
        const assign = stmt.match(/^(\w+)\s*=\s*(.+)$/);
        if (assign) {
            const [, name, expr] = assign;
            if (name in variables) {
                variables[name] = safeEvaluate(expr, variables);
            }
            continue;
        }
    }

    appendConsole("Simulation finished.", 'system');
    updateVariablesDisplay();
}

function appendConsole(text, className = 'output') {
    const output = document.getElementById('console-output');
    if (!output) return;
    const div = document.createElement('div');
    div.className = className;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function waitForUserInput() {
    return new Promise(resolve => {
        pendingInputResolver = resolve;
        const inputArea = document.getElementById('console-input-area');
        const inputField = document.getElementById('console-input');
        if (inputArea && inputField) {
            inputArea.classList.remove('hidden');
            inputField.focus();
        }
    });
}
