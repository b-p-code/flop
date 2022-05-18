/***** TITLE *****/
// Flop interpreter
/*****************/

/***** DESCRIPTION *****/
// A simple interpreter for the Flop commands
// This is just a fun project, not meant to be serious
// The code is of course not great, as are the commands and their syntax
// This is merely meant to be a fun side project
/***********************/

/***** FLOP COMMANDS *****/
// Note - all of these commands use nonstandard names

// say:
// This command outputs to the window below
// Ex: say hello my friend!
// Output: hello my friend!

// flop:
// This command declares a variable
// If no value is given it is defaulted to ""
// Ex: flop myVar value
// Now a variable called myVar exists with the value "value"

// give:
// Assigns a variable a value (assuming it has been declared)
// Ex: give myVar 3
// Now the previously existing myVar holds the value 3

// expr:
// This command evaluates an expression
// It cannot stand alone as a statement
// It has many limitations - the expressions are evaluated without precedence, from left to right
// Ex: say expr 1 + 2
// Output: 3
/*************************/

/***** COPYRIGHT *****/
// Copyright 2022 Bryce Paubel
/*********************/

/***** LICENSING *****/
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
/*********************/


let editor;

function setupCodeMirror() {
    editor = CodeMirror.fromTextArea(document.getElementById('flop'), {
        lineNumbers: true,
        mode: 'text/perl-x',
        matchBrackets: true,
    });

    editor.setOption('theme', 'cobalt');

    editor.setOption("value",
        "# Example Flop Program\n" +
        "\n" +
        "flop myVar 3\n" +
        "flop myOtherVar 2\n" +
        "\n" +
        "say Well, here is some math!\n" +
        "say 3 + 2 is expr myVar + myOtherVar\n" +
        "say 3 - 2 is expr myVar - myOtherVar\n" +
        "say 3 * 2 is expr myVar * myOtherVar\n" +
        "say 3 / 2 is expr myVar / myOtherVar"
    );
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

    let stop = false;
    let value = "";
    let output = "";
    let vars = [];
    let i = 0;
    while (lines[i] !== null && !stop) {
        let line = lines[i].split(" ");

        // Check commands
        switch (line[0]) {
            case "":
            case "#":
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
                if (searchVar(line[1], vars) === -1) {
                    for (let i = 2; i < line.length; i++) {
                        let index = searchVar(line[i], vars);
                        if (index !== -1) {
                            value += vars[index].value + " ";
                        } else if (line[i] === "expr") {
                            value += evalExpr(line.slice(i + 1, line.length), vars) + " ";
                            break;
                        } else {
                            value += line[i] + " ";
                        }
                    }

                    value = value.trim();

                    let variable = { name: line[1], value: value };

                    vars.push(variable);
                    value = "";
                    console.log("Initializing and assigning variable " + variable.name + " to value " + variable.value);
                } else {
                    stop = true;
                    output = "Error at line " + (i + 1) + ". " + line[1] + " already exists.";
                    break;
                }
                break;
            case "give":
                let varIndex = searchVar(line[1], vars);
                console.log(varIndex);
                if (varIndex !== -1) {
                    for (let i = 2; i < line.length; i++) {
                        let index = searchVar(line[i], vars);
                        if (index !== -1) {
                            value += vars[index].value + " ";
                        } else if (line[i] === "expr") {
                            value += evalExpr(line.slice(i + 1, line.length), vars) + " ";
                            break;
                        } else {
                            value += line[i] + " ";
                        }
                    }

                    value = value.trim();

                    vars[varIndex].value = value;

                    value = "";
                    console.log("Assigning variable " + vars[varIndex].name + " to value " + vars[varIndex].value);
                } else {
                    stop = true;
                    output = "Error at line " + (i + 1) + ". " + line[1] + " does not exist.";
                    break;
                }
                break;
            default:
                stop = true;
                output = "Error at line " + (i + 1);
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

