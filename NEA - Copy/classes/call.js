import { pInstruction } from './instruction.js';

export class pCall extends pInstruction {
    constructor(givenLine, givenIdentifier) {
        super(givenLine); 
        this.identifier = givenIdentifier; 
    }

    execute(pMemory, pSubroutines) {
        //invalid call
        if (!(this.identifier in pSubroutines)) {
            console.log(this.identifier + " procedure not found");
            return;
        }

        pSubroutines[this.identifier].execute(pMemory);
    }
}