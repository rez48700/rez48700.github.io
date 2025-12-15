import { pVariable } from '../datatypes/variable.js';
import { pArray } from '../datatypes/array.js';
import { pInstruction } from '../classes/instruction.js';
import { pOutput } from '../classes/print.js';
import { pAssign } from '../classes/assign.js';
import { pInput } from '../classes/input.js';
import { pBranch} from '../classes/branch.js';
import { pSelect} from '../classes/if.js';
import { pFor } from '../classes/for.js';
import { pWhile } from '../classes/while.js';
import { pProcedure } from '../classes/procedure.js';
import { pCall } from '../classes/call.js';

const runButton = document.getElementById('runbutton');
const pScript = document.getElementById('pScript');
const pConsole = document.getElementById('pConsole');
const pConsoleInput = document.getElementById('pConsoleInput');

var instructions = [];
var lines = [];
var compiledScript = [];
var pMemory = [];
var pSubroutines = {}; //dictionary
var lineNum;

runButton.addEventListener('click', () => {
  pMemory = [];
  pConsole.value = ""
  compiledScript = pCompile(pScript.value);
  compiledScript = compiledScript.filter(instruction => instruction !== null); // filter null instructions
  pInterpret(compiledScript);
});

function pCompile(script) {
  instructions = []; //reset all
  pMemory = [];
  pSubroutines = {};
  lines = script.split('\n');
  lineNum = 0;

  while (lineNum < lines.length) {
    let line = lines[lineNum].trim()
    if (line === "") {
      lineNum++;
      continue;
    }

    if (line.substring(0, 1) === "#") {
      //Comment
    }
    else {
      // catch instructon built
      instructions.push(instructionFactory(line))
    }

    lineNum++;
  }

  return instructions;
}

function instructionFactory(line) {
  //construct keyword
  let keyword = "";
  for (let i = 0; i < line.length; i++) {
      if (line[i] == " " || line[i] == "(") break;
      keyword += line[i];
  }

  //construct instruction
    if (keyword == "print") {
      return printBuilder(line)
    }
    else if (keyword == "if")  {
      return ifBuilder(line)
    }
    else if (keyword == "for") {
      return forBuilder(line)
    }
    else if (keyword == "while") {
      return whileBuilder(line)
    }
    else if (keyword == "procedure") {
      return procedureBuilder(line);
    }
    else if (keyword == "call") {
      return callBuilder(line);
    }else if (keyword == "array") {
        return arrayBuilder(line);
    }
    else if (line.includes("input")) {
      return inputBuilder(line, keyword)     
    }
    else {
        //pAssign - default behaviour
        if (!(line.includes("="))) {
            instructions.push("Invalid assignment at:" + lineNum) 
        }else {
          let variable = keyword;
          let expression = line.substring(line.indexOf("=") + 1)
          return new pAssign(lineNum, expression, variable)
        } 
    }
}

function printBuilder(line) {
  //pOutput
  if (!(line.includes(")"))) {
   instructions.push("Expression not closed at line: " + lineNum)
   return
  }
  else {
   let expression = line.substring(line.indexOf("(") + 1, line.indexOf(")"));
   return new pOutput(lineNum, expression);
  }
}

function inputBuilder(line,keyword) {
  //pInput
  if (!(line.includes("="))) {
    instructions.push("Invalid assignment at:" + lineNum)
    return
  }else if (!(line.includes(")"))) {
    instructions.push("Expression not closed at line: " + lineNum)
    return
  }else {
    let variable = keyword
    let expression = line.substring(line.indexOf("(") + 1, line.indexOf(")"));
    return new pInput(new pOutput(lineNum, expression), new pAssign(lineNum, null, variable))
  } 
}

function ifBuilder(line) {
  //create block for if statement
  let subLines = [];
  let conditions = [];
  let branches = [];
  let branch = []; //list of instructions going into each branch

  for (let i = lineNum; i < lines.length; i++) {
    subLines.push(lines[i].trim());
    if (lines[i].trim() == "endif" || lines[i].trim() == "end if") {break};
  }
  //iterate through the block
  for (let i = 0; i < subLines.length - 1; i++) {
    let subLine = subLines[i]

    if (subLine.includes("if")) {// create condition      
      let condition = ""
      if (subLine.includes("then")) {
        // iterate through chars until then reached
        for (let j = subLine.indexOf("if") + 2; j < subLine.length; j++) {
          if (subLine.substring(j) == "then") {break}
          condition += subLine.substring(j, j + 1)
        }
        conditions.push(condition)
      }else {
        instructions.push("condition not closed at:" + lineNum)
      }

    }
    else if (subLine == "else"){
      conditions.push("true")
    }
    else {// build branch
      branch.push(instructionFactory(subLine));
      
      // finish branch
      if (subLines[i + 1].includes("if") || subLines[i + 1].includes("else")) {
        console.log("branch initialised")
        console.log(branch)
        branches.push(new pBranch(lineNum, branch))
        branch = [];
      }
    }
  }
  
  lineNum += subLines.length - 1

  return new pSelect(lineNum,conditions,branches)
}

function forBuilder(line) {
  
  let subLines = [];
  let branch = [];


  // create block of for statement
  for (let i = lineNum; i < lines.length; i++) {
    if (lines[i].trim().substring(0, 4) == "next") {break};
    subLines.push(lines[i]);
  }
  let subLine = subLines[0]
  let components = subLine.split(" ")

  // error handler
  if (components.length < 6 || components[0] !== "for" || components[2] !== "=" || components[4].toLowerCase() !== "to") {
    instructions.push("Invalid for loop syntax at line: " + lineNum);
    return;
  }
  
  // iterate through block
  for (let i = 1; i < subLines.length; i++) {
    subLine = subLines[i].trim()
    const instruction = instructionFactory(subLine)
    if (instruction instanceof pInstruction) {
      branch.push(instruction)
    }
    
  }

  // create variable for iterator
  const assignIterator = new pAssign(lineNum, components[3], components[1])
  assignIterator.execute(pMemory);

  // update line number
  lineNum += subLines.length

  return new pFor(lineNum, components[1], components[5], new pBranch(lineNum, branch))
}

function whileBuilder(line) {
  let subLines = [];
  let branch = [];

  // create block of while statement
  for (let i = lineNum; i < lines.length; i++) {
    if (lines[i].trim().toLowerCase() === "end while"  || lines[i].trim().toLowerCase() == "endwhile") break;
    subLines.push(lines[i]);
  }

  // create condition
  let subLine = subLines[0].trim();
  let condition = "";
  if (subLine.includes("(") && subLine.includes(")")) {
    condition = subLine.substring(subLine.indexOf("(") + 1, subLine.indexOf(")")).trim();
  } else {
    instructions.push("Invalid while syntax at line: " + lineNum);
    return;
  }

  // iterate through block
  for (let i = 1; i < subLines.length; i++) {
    let subLine = subLines[i].trim();
    const instruction = instructionFactory(subLine);

    if (instruction instanceof pInstruction) {
      branch.push(instruction);
    }
  }

  // update line number
  lineNum += subLines.length;

  return new pWhile(lineNum, condition, new pBranch(lineNum, branch));
}

function callBuilder(line) {
  let components = line.trim().split(" ");
  if (components[0] !== "call" || components.length < 2) {
      return "Invalid procedure call at line: " + lineNum;
  }

  return new pCall(lineNum, components[1]);
}

function procedureBuilder(line) {
  let subLines = [];
  let branch = [];

  //create block for subroutine
  for (let i = lineNum + 1; i < lines.length; i++) {
      if (lines[i].trim().toLowerCase() === "end procedure") {
        break;
      }
      subLines.push(lines[i]);
  }
  

  //error handler
  let components = line.trim().split(" ");
  if (components[0] != "procedure" || components.length < 2) {
      return "Invalid procedure declaration at line: " + lineNum;
  }

  let identifier = components[1];

  //iterate through the block
  for (let i = 0; i < subLines.length; i++) {
    let subLine = subLines[i].trim()
    const instruction = instructionFactory(subLine)
    if (instruction instanceof pInstruction) {
      branch.push(instruction)
    }
  }

  // store as a subroutine
  pSubroutines[identifier] = new pProcedure(lineNum, identifier, new pBranch(lineNum, branch));

  lineNum += subLines.length + 1; //update line number

  return null;
}

function functionBuilder(line) {

}

async function pInterpret(script) {
  console.log(script);
  console.log(pMemory);
  console.log(pSubroutines)

  for (const instruction of script) {
    if (typeof instruction === "string") {
      // display errors
      pConsole.value += instruction + "\n";
    } 
    else if (instruction instanceof pCall) {
        await instruction.execute(pMemory, pSubroutines);
    } 
    else {
        await instruction.execute(pMemory);
    }
  }
}

function arrayBuilder(line) {
    // remove "array " prefix
    var declaration = line.trim().substring(6).trim(); 
    var name = declaration.split("[")[0].trim();
    var sizePart = declaration.split("[")[1];
    
    if (!sizePart) return "Invalid array declaration at line: " + lineNum;

    var size = parseInt(sizePart.split("]")[0].trim());
    if (isNaN(size)) return "Invalid array size at line: " + lineNum;

    var values = [];
    if (declaration.indexOf("=") > -1) {
        var valPart = declaration.split("=")[1].trim();
        values = valPart.split(",").map(function(v) { return v.trim(); });
    }

    var newArray = new pArray(name, size, values);
    pMemory.push(newArray);

    return null; // declaration doesn't return an instruction
}


