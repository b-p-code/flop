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

    if(!text || text === "") {
        console.log("error");
    } else {
        interpretFlop(text);
    }
}

function interpretFlop(input) {
    let cout = document.getElementById("output");

    let lines = input.split(/\r?\n/);
    lines.push(null);

    console.log(lines);

    let i = 0;
    while (lines[i]) {
        let output = "";
        let line = lines[i].split(" ");
        switch (line[0]) {
            case "say":
                for (let i = 1; i < line.length; i++) {
                    output += line[i] + " ";
                }
                cout.value = output;
                output = "";
                break;
            default:
                cout.value = "error at line " + (i + 1);
        }
        i++;
    }
}