import { pInstruction } from './instruction.js';

export class pSelect extends pInstruction {
    constructor(givenLine, givenConditions, givenBranches) {
        super(givenLine)
        this.conditions = givenConditions;
        this.branches = givenBranches;       
    }

    execute(pMemory) {
        // overridden method
        
        for (let i = 0; i < this.conditions.length; i++) {
            if (this.evaluate(this.conditions[i], pMemory)) //check if current condition is true
            {
                //execute entire branch
                this.branches[i].execute(pMemory);
                break;
            }
        }
    }
}