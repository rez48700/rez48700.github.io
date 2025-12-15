import { pInstruction } from './instruction.js';

export class pDo extends pInstruction {
  constructor(givenLine, givenCondition, givenBranch) {
    super(givenLine);
    this.condition = givenCondition;
    this.branch = givenBranch;
  }

 execute(pMemory) {
    // overridden method
    do {
      this.branch.execute(pMemory);
    } while (!this.evaluate(this.condition, pMemory));
  }
}
