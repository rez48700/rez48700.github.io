// buttons
const clearButton = document.getElementById("clearbutton");
const settingsButton = document.getElementById("settingsbutton");
const helpButton = document.getElementById("helpbutton");

// modals
const settingsModal = document.getElementById("settingsModal");
const settingsClose = document.getElementById("settingsClose");
const textSizeSlider = document.getElementById("textSizeSlider");
const textSizeValue = document.getElementById("textSizeValue");

// text areas
const pScript = document.getElementById("pScript");
const pConsole = document.getElementById("pConsole");
const pConsoleInput = document.getElementById("pConsoleInput");

// clear button functionality
clearButton.addEventListener("click", () => {
  pScript.value = "";
  pConsole.value = "";
  pConsoleInput.value = "";
});

// help button functionality
helpButton.addEventListener("click", () => {
  const help = `
output: print(string) 
assign: name = value
input: name = input(string) 

# selection:
If <condition> then
end if

# loops:
For <name> = <start> to <end>
next <name>

While <condition>
end while

# subroutines:
procedure <identifier>
end procedure

function <identifier>
  return <value>
end function
`;
  alert(help);
});

// open settings modal
settingsButton.addEventListener("click", () => {
  settingsModal.classList.remove("hidden");
});

// close settings modal
settingsClose.addEventListener("click", () => {
  settingsModal.classList.add("hidden");
});

// Update font size live
textSizeSlider.addEventListener("input", () => {
  const size = textSizeSlider.value;
  textSizeValue.textContent = size;

  pScript.style.fontSize = size + "px";
  pConsole.style.fontSize = size + "px";
});
