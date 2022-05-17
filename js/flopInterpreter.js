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
    interpretFlop(text);
}

function interpretFlop(input) {
    let cout = document.getElementById("output");

    if (!input || input === "") {
        cout.value = "Error";
        return;
    }

    let lines = input.split(/\r?\n/);
    lines.push(null);

    let value = "";
    let output = "";
    let vars = [];
    let i = 0;
    while (lines[i] !== null) {
        let line = lines[i].split(" ");

        // Check commands
        switch (line[0]) {
            case "":
                break;
            case "say":
                let tempOut = "";

                for (let i = 1; i < line.length; i++) {
                    let index = searchVar(line[i], vars);
                    if (index !== -1) {
                        tempOut += vars[index].value + " ";
                    } else if (line[i] === "expr") {
                        tempOut += evalExpr(line.slice(i + 1, line.length), vars) + " ";
                        break;
                    } else {
                        tempOut += line[i] + " ";
                    }
                }

                tempOut = tempOut.trim();

                output += tempOut + " \n";
                console.log("Saying " + tempOut);

                break;
            case "flop":
                for (let i = 2; i < line.length; i++) {
                    let index = searchVar(line[i], vars);
                    if (index !== -1) {
                        value += vars[index].value + " ";
                    } else if (line[i] === "expr") {
                        tempOut += evalExpr(line.slice(i + 1, line.length), vars) + " ";
                        break;
                    } else {
                        value += line[i] + " ";
                    }
                }

                value = value.trim();

                let variable = { name: line[1], value: value };

                vars.push(variable);
                value = "";
                console.log("Assigning variable " + variable.name + " to value " + variable.value);

                break;
            default:
                output = "Error at line " + (i + 1);
                return;
        }
        i++;
    }

    cout.value = output;
    output = "";
}

function searchVar(variableName, varArray) {
    for (let i = 0; i < varArray.length; i++) {
        if (varArray[i].name === variableName) {
            return i;
        }
    }

    return -1;
}

function evalExpr(array, vars) {
    console.log(array);

    let index = searchVar(array[0], vars);
    let num = array[0];
    if (index !== -1) {
        num = vars[index].value;
    }

    let result = Number(num);

    if (isNaN(result)) {
        return "N/A";
    }

    for (let i = 0; i < array.length - 2; i+=2) {
        let index = searchVar(array[i + 2], vars);
        let num = array[i + 2];
        if (index !== -1) {
            num = vars[index].value;
        }
        num = Number(num);
        if (isNaN(num)) {
            return "N/A";
            break;
        }
        switch (array[i + 1]) {
            case "+":
                result += num;
                break;
            case "-":
                result -= num;
                break;
            case "/":
                result /= num;
                break;
            case "*":
                result *= num;
                break;
            default:
                return "N/A";
                break;
        }
    }

    return result;
}

