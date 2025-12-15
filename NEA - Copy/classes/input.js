import { pInstruction } from './instruction.js';

export class pInput extends pInstruction {
    
    constructor(givenOutput, givenAssign) {
        super();
        this.output = givenOutput;
        this.assign = givenAssign;
        // extracts line from output object
        this.line = this.output.getLine;
    }

    execute(pMemory) {
        // overridden method

        return new Promise((resolve) => {
            let inputValue;

            // prompt user for an input
            this.output.execute(pMemory);
            alert("Enter input")

            // event listener for accepting the input
            const handleInput = (event) => {
                 if (event.key === 'Enter') {
                    inputValue = pConsoleInput.value;
                    pConsoleInput.value = '';

                    pConsoleInput.removeEventListener('keydown', handleInput);

                    // run the internal assign statement
                    this.assign.setExpression(inputValue);
                    this.assign.execute(pMemory);

                    // ends input event
                    resolve();
            }};

             // attach pre-defined event listener
             pConsoleInput.addEventListener('keydown', handleInput);
        }) 
    }
}