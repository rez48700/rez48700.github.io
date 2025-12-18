import { pVariable } from '../datatypes/variable.js';
import { pArray } from '../datatypes/array.js';

export class pInstruction {
    constructor(givenLine) {
        this.line = givenLine;
    }

    execute() {
        return;
    }

    evaluate(expression, pMemory) {

        expression = expression.trim();


        // replace variables and arrays
        pMemory.forEach(function(item) {
            if (item instanceof pVariable) {
                var varRegex = new RegExp("\\b" + item.getName() + "\\b", 'g');
                expression = expression.replace(varRegex, item.getValue());
            }
            else if (item instanceof pArray) {
               var arrayRegex = new RegExp(item.getName() + "\\[(\\d+)\\]", 'g');
               expression = expression.replace(arrayRegex, function(match, index) {
                return item.getValue(parseInt(index));
                });
            }
        });

        // arithmetic
        var mathRegex = new RegExp("(\\d+)\\s*\\+\\s*(\\d+)", "g");
        expression = expression.replace(mathRegex, "($1 + $2)");

        return eval(expression);
    }



    getLine() {
        return this.line;
    }
}