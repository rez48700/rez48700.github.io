import { pInstruction } from './instruction.js';

export class pBranch extends pInstruction {
    constructor(givenLine, givenInstructions) {
        super(givenLine)
        this.instructions = givenInstructions;        
    }

    async execute(pMemory) {
        //iterate through branch
        for (const instruction of this.instructions) {
           if (typeof instruction === "string") {
           // display errors
           pConsole.value += instruction + "\n";
           } 
           else {
            instruction.execute(pMemory); 
           }
        }
    }
}