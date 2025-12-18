import { pInstruction } from './instruction.js';

export class pProcedure extends pInstruction {
    constructor(givenLine, givenIdentifier, givenParameters, givenBranch) {
        super(givenLine);
        this.identifier = givenIdentifier;
        this.parameters = givenParameters;
        this.branch = givenBranch;
    }

    getName() {
        return this.identifier;
    }

    getParameters() {
        return this.parameters;
    }

    getBranch() {
        return this.branch;
    }
}
