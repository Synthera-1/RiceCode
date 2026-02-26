// simulator.js - Java-like execution engine

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
    } catch {
        return `<<error>>`;
    }
}

function extractMainBody(code) {
    const match = code.match(/public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*args\s*\)\s*\{([\s\S]*?)\}(?:\s*\}|$)/i);
    return match ? match[1] : code;
}

function parseAndExecute(code) {
    variables = {};
    const output = [];
    const mainBody = extractMainBody(code);
    const clean = mainBody
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');

    const statements = clean.split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    for (let stmt of statements) {
        const decl = stmt.match(/^(int|double|float|long|String|boolean|char|var)\s+(\w+)\s*=\s*(.+)$/i);
        if (decl) {
            const [, , name, expr] = decl;
            variables[name] = safeEvaluate(expr, variables);
            continue;
        }

        const bare = stmt.match(/^(int|double|float|long|String|boolean|char|var)\s+(\w+)$/i);
        if (bare) {
            const [, type, name] = bare;
            variables[name] = type.toLowerCase() === 'string' ? '' : 0;
            continue;
        }

        const assign = stmt.match(/^(\w+)\s*=\s*(.+)$/);
        if (assign) {
            const [, name, expr] = assign;
            if (name in variables) {
                variables[name] = safeEvaluate(expr, variables);
            }
            continue;
        }

        const print = stmt.match(/^System\.out\.(println|print)\s*\(\s*(.+)\s*\)$/i);
        if (print) {
            const [, , arg] = print;
            output.push(safeEvaluate(arg, variables));
            continue;
        }
    }

    return output;
}
