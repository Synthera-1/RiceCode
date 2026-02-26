// main.js - entry point & button bindings

document.addEventListener('DOMContentLoaded', () => {
    // Default example code
    editor.value = `// Welcome to Java Pro IDE!
public class Main {
    public static void main(String[] args) {
        int x = 15;
        int y = 7;
        int sum = x + y;
        
        System.out.println("Sum: " + sum);
        System.out.println("x > y: " + (x > y));
        
        String msg = "Hello " + "World!";
        System.out.println(msg);
        
        double pi = Math.PI;
        System.out.println("PI ≈ " + pi);
    }
}`;

    updateStatus();
    updateVariablesTab();
    updateAutoButton();

    document.getElementById('runBtn').addEventListener('click', runCode);
    document.getElementById('formatBtn').addEventListener('click', formatCode);
    document.getElementById('clearBtn').addEventListener('click', clearAll);
    document.getElementById('autoBtn').addEventListener('click', toggleAutoComplete);

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
});
