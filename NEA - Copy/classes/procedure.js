import { pInstruction } from './instruction.js';
import { pBranch } from './branch.js';

export class pProcedure extends pInstruction {
    constructor(givenLine, givenIdentifier, givenBranch) {
        super(givenLine); 
        this.Identifier = givenIdentifier;
        this.branch = givenBranch;
    }

    execute(pMemory) {
        // overriden method
        this.branch.execute(pMemory);
    }
}
