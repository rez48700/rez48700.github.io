import { pInstruction } from './instruction.js';

export class pWhile extends pInstruction {
    constructor(givenLine, givenConditon, givenBranch) {
        super(givenLine)
        this.condition = givenConditon;
        this.branch = givenBranch;
    }


    execute(pMemory) {
        // overridden method
        while (this.evaluate(this.condition, pMemory)) {
            this.branch.execute(pMemory);
        }
    }
}
