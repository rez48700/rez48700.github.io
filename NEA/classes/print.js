import { pInstruction } from './instruction.js';

export class pOutput extends pInstruction {
    constructor(givenLine, givenExpression) {
        super(givenLine)
        this.expression = givenExpression
    }

    execute(pMemory) {
        // overridden method
        pConsole.value += this.evaluate(this.expression, pMemory) + "\n"
    }
}