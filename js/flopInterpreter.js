let editor;

function setupCodeMirror() {
    editor = CodeMirror.fromTextArea(document.getElementById('flop'), {
        lineNumbers: true,
        mode: 'text/perl-x',
        matchBrackets: true,
    });

    editor.setOption('theme', 'cobalt');
}

function run() {
    let text = editor.getValue();

    console.log(text);

    if(!text || text === "") {
        console.log("error");
    } else {
        interpretFlop(text);
    }
}

function interpretFlop(input) {
    let lines = input.split(/\r?\n/);
}