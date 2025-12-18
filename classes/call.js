import { pInstruction } from './instruction.js';
import { pVariable } from '../datatypes/variable.js';

export class pCall extends pInstruction {
    constructor(givenLine, givenName, givenArgumentsList) {
        super(givenLine);
        this.name = givenName;
        this.argumentsList = givenArgumentsList; // must match the callBuilder
    }

    async execute(pMemory, pSubroutines) {
        let procedure = pSubroutines[this.name];
        if (!procedure) {
            pConsole.value += "Procedure not found at line " + this.line + "\n";
            return;
        }

        let parameters = procedure.getParameters();
        let branch = procedure.getBranch();

        if (this.argumentsList.length !== parameters.length) {
            pConsole.value += "Incorrect number of arguments at line " + this.line + "\n";
            return;
        }

        let temporaryVariables = [];

        for (let index = 0; index < parameters.length; index++) {
            let parameterName = parameters[index];
            let argumentExpression = this.argumentsList[index];

            let evaluatedValue = this.evaluate(argumentExpression, pMemory);
            let parameterVariable = new pVariable(parameterName, argumentExpression);

            pMemory.push(parameterVariable);
            temporaryVariables.push(parameterVariable);
        }

        await branch.execute(pMemory);

        // remove temporary variables
        for (let index = 0; index < temporaryVariables.length; index++) {
            let variableIndex = pMemory.indexOf(temporaryVariables[index]);
            if (variableIndex > -1) {
                pMemory.splice(variableIndex, 1);
            }
        }
    }
}
