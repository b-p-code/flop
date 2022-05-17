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

    let value = "";
    let output = "";
    let vars = [];
    let i = 0;
    while (lines[i]) {
        let line = lines[i].split(" ");
        switch (line[0]) {
            case "say":
                let tempOut = "";

                for (let i = 1; i < line.length; i++) {
                    let index = searchVar(line[i], vars);
                    console.log(index);
                    if (index !== -1) {
                        tempOut += vars[index].value + " ";
                    } else {
                        tempOut += line[i] + " ";
                    }
                }

                output += tempOut;
                console.log("Saying " + tempOut);

                break;
            case "flop":
                for (let i = 2; i < line.length; i++) {
                    let index = searchVar(line[i], vars);
                    if (index !== -1) {
                        value += vars[i].value + " ";
                    } else {
                        value += line[i] + " ";
                    }
                }

                let variable = { name: line[1], value: value };

                vars.push(variable);
                value = "";
                console.log("Assigning variable " + variable.name + " to value " + variable.value);

                break;
            default:
                output = "Error at line " + (i + 1);
        }
        i++;
    }

    cout.value = output;
    output = "";
}

function searchVar(variableName, varArray) {
    for (let i = 0; i < varArray.length; i++) {
        console.log(varArray[i].name + variableName);
        if (varArray[i].name === variableName) {
            return i;
        }
    }

    return -1;
}