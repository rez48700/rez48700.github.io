import { pInstruction } from './instruction.js';
import { pAssign } from "./assign.js";

export class pFor extends pInstruction {
    constructor(givenLine, givenIterator, givenConditon, givenBranch) {
        super(givenLine)
        this.iterator = givenIterator;
        this.condition = givenConditon;
        this.branch = givenBranch;
    }


    execute(pMemory) {
        // overridden method
    
        for (let i = this.evaluate(this.iterator, pMemory); i <= this.condition; i++) {
            //execute branch
            this.branch.execute(pMemory);
            //update iterator
            let val = "" + (i + 1) //cast to string

            // updateIterator.execute(pMemory)
            const updateIterator = new pAssign(this.line, val, this.iterator);
            updateIterator.execute(pMemory);  
        }
    }
}
