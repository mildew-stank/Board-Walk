let noteElements = [];
let openLabel;
const portraitQuery = window.matchMedia("(orientation: portrait)");
const userPrompt = document.getElementById("prompt");
const helpButton = document.getElementById("help");
const closeButton = document.getElementById("close");
const modalContainer = document.getElementById("modalContainer");
const fretboardContainer = document.getElementById("fretboardContainer");
const stringLength = 13;
const fretboard = [
  ["E", "F", "", "G", "", "A", "", "B", "C", "", "D", "", "E"],
  ["B", "C", "", "D", "", "E", "F", "", "G", "", "A", "", "B"],
  ["G", "", "A", "", "B", "C", "", "D", "", "E", "F", "", "G"],
  ["D", "", "E", "F", "", "G", "", "A", "", "B", "C", "", "D"],
  ["A", "", "B", "C", "", "D", "", "E", "F", "", "G", "", "A"],
  ["E", "F", "", "G", "", "A", "", "B", "C", "", "D", "", "E"],
  ["OPEN", "", "", "3", "", "5", "", "7", "", "9", "", "", "12"],
];
const notes = {
  "a": 0,
  "a#": 1,
  "bb": 1,
  "b": 2,
  "c": 3,
  "c#": 4,
  "db": 4,
  "d": 5,
  "d#": 6,
  "eb": 6,
  "e": 7,
  "f": 8,
  "f#": 9,
  "gb": 9,
  "g": 10,
  "g#": 11,
  "ab": 11,
};
const openNotes = {
  0: notes["e"],
  1: notes["b"],
  2: notes["g"],
  3: notes["d"],
  4: notes["a"],
  5: notes["e"],
};
const intervals = {
  // scales
  "major": [0, 2, 2, 1, 2, 2, 2],
  "minor": [0, 2, 1, 2, 2, 1, 2],
  "pentatonic major": [0, 2, 2, 3, 2],
  "pentatonic minor": [0, 3, 2, 2, 3],
  // chords
  "power": [0, 7],
  "power chord": [0, 7],
  "major diad": [0, 4],
  "minor diad": [0, 3],
  "major triad": [0, 4, 3],
  "minor triad": [0, 3, 4],
  "major seventh": [0, 4, 3, 4],
  "minor seventh": [0, 3, 4, 3],
  "diminished": [0, 3, 3],
  "diminished seventh": [0, 3, 3, 3],
  "augmented": [0, 4, 4],
  "augmented seventh": [0, 4, 4, 2],
  "dominant seventh": [0, 4, 3, 3],
};

// entry point
function main() {
  generateGridLayout();
  openLabel = document.getElementById("open");
  noteElements = Array.from(fretboardContainer.getElementsByClassName("notes"));
  noteElements.length -= stringLength; // remove labels
  userPrompt.value = "";
  userPrompt.focus();
}
main();

function generateGridLayout() {
  for (let stringIndex = 0; stringIndex < fretboard.length; stringIndex++) {
    const stringArray = fretboard[stringIndex];

    for (let noteIndex = 0; noteIndex < stringArray.length; noteIndex++) {
      const note = stringArray[noteIndex];
      const column = numberToLetter(stringIndex);
      const isLabelRow = stringIndex == fretboard.length - 1;
      const noteElement = generateGridElement(note, isLabelRow);

      noteElement.style.gridArea = `${column}${noteIndex + 1}`;
      fretboardContainer.appendChild(noteElement);
    }
  }
}

function generateGridElement(note, isLabelRow) {
  const noteElement = document.createElement("div");

  if (!isLabelRow) {
    noteElement.className = note != "" ? "notes" : "notes blacks";
    noteElement.innerHTML = note;
    return noteElement;
  }
  noteElement.className = "notes labels";
  if (note == "OPEN") {
    noteElement.id = "open";
    if (portraitQuery.matches) {
      noteElement.innerHTML = "0";
      return noteElement;
    }
  }
  noteElement.innerHTML = note;
  return noteElement;
}

function numberToLetter(number) {
  return String.fromCharCode(97 + number);
}

function handleInputChange() {
  const commands = this.value.toLowerCase().split(" ");

  commands.length = 3; // commands are not expected to exceed 3 words
  revertNotes();
  if (commands[0] in notes) {
    const intervalCommand = `${commands[1] || ""} ${commands[2] || ""}`.trim();
    const interval = intervals[intervalCommand] || [0];
    for (let i = 0; i < 6; i++) {
      highlightNotesOnString(i, openNotes[i], notes[commands[0]], interval);
    }
  }
}

function revertNotes() {
  for (let index = 0; index < noteElements.length; index++) {
    clearStyle(noteElements[index]);
  }
}

function highlightNotesOnString(string, open, note, scale) {
  const offset = note - open;
  let fret = offset < 0 ? 12 + offset : offset;
  let isRoot = true;

  string *= stringLength;
  for (let i = 0; i < scale.length; i++) {
    fret += scale[i];
    fret %= 12;
    if (fret == 0) {
      setStyle(noteElements[string + 12], isRoot);
    }
    setStyle(noteElements[string + fret], isRoot);
    isRoot = false;
  }
}

function setStyle(element, isRoot) {
  if (isRoot) {
    element.style.borderRadius = "50% 5% 50% 50%";
  }
  if (element.class == "blacks") {
    element.style.background = "#f39c12";
    return;
  }
  element.style.background = "#f1c40f";
}

function clearStyle(element) {
  element.style.removeProperty("background");
  element.style.removeProperty("border-radius");
}

function handlePortrait(event) {
  if (event.matches) {
    openLabel.innerHTML = "0";
  } else {
    openLabel.innerHTML = "OPEN";
  }
}

function handleHelpButton() {
  modalContainer.style.visibility = "visible";
}

function handleCloseButton(event) {
  if (event.target != modalContainer && event.target != closeButton) {
    return;
  }
  modalContainer.style.visibility = "hidden";
}

portraitQuery.addEventListener("change", handlePortrait);
userPrompt.addEventListener("input", handleInputChange);
helpButton.addEventListener("click", handleHelpButton);
closeButton.addEventListener("click", handleCloseButton);
modalContainer.addEventListener("click", handleCloseButton);
