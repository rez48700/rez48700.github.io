import { pVariable } from '../datatypes/variable.js';
import { pArray } from '../datatypes/array.js';
import { pInstruction } from './instruction.js';

export class pAssign extends pInstruction {
    constructor(givenLine, givenExpression, givenVariable) {
        super(givenLine);
        this.expression = givenExpression;
        this.variable = givenVariable;
    }

    setExpression(newExpression) {
        this.expression = newExpression;
    }

    execute(pMemory) {

    let result = this.evaluate(this.expression, pMemory);

    // ensure strings are stored with quotes
    if (typeof result === "string") {
        if (
            !(result.startsWith('"') && result.endsWith('"')) &&
            !(result.startsWith("'") && result.endsWith("'"))
        ) {
            result = '"' + result + '"';
        }
    }

    // array element assignment
    if (this.variable.includes("[") && this.variable.includes("]")) {
        let arrayName = this.variable.split("[")[0];
        let index = parseInt(
            this.variable.split("[")[1].split("]")[0]
        );

        pMemory.forEach(item => {
            if (item instanceof pArray && item.getName() === arrayName) {
                item.setValue(index, result);
            }
        });
        return;
    }

    // variable assignment
    pMemory.forEach(pVariable => {
        if (pVariable.getName() == this.variable) {
            pVariable.setValue(result);
            return;
        }
    });

    // create new variable
    pMemory.push(new pVariable(this.variable, result));
}

}
