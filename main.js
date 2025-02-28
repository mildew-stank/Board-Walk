const inputField = document.getElementById("key");
const aboutButton = document.getElementById("about-button");
const aboutModal = document.getElementById("modal-background");
const strings = Array.from(document.getElementsByClassName("string")).map(string => string.getElementsByClassName("note"));

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
    "dominant seventh": [0, 4, 3, 3]
};

function init() {
    inputField.value = "";
}

function onInputChange() {
    const commands = this.value.toLowerCase().split(" ");

    commands.length = 3;
    revertNotes();

    if (commands[0] in notes) {
        const intervalCommand = `${commands[1] || ""} ${commands[2] || ""}`.trim();
        const interval = intervals[intervalCommand] || [0];

        for (let i = 0; i < strings.length; i++) {
            highlightNotesOnString(i, openNotes[i], notes[commands[0]], interval);
        }
    }
}

function revertNotes() {
    for (let string = 0; string < strings.length; string++) {
        for (let fret = 0; fret < strings[string].length; fret++) {
            clearStyle(strings[string][fret]);
        }
    }
}

function highlightNotesOnString(string, open, note, scale) {
    const offset = note - open;
    let fret = offset < 0 ? 12 + offset : offset;
    let isRoot = true;

    for (let i = 0; i < scale.length; i++) {
        fret += scale[i];
        fret %= 12;
        if (fret == 0) setStyle(strings[string][12], isRoot);
        setStyle(strings[string][fret], isRoot);
        isRoot = false;
    }
}

function setStyle(element, isRoot) {
    if (isRoot) element.style.borderRadius = "50% 5% 50% 50%"
    if (element.id == "half") {
        element.style.background = "#f39c12";
        return;
    }
    element.style.background = "#f1c40f";
}

function clearStyle(element) {
    element.removeAttribute("style");
}

function onAboutOpen() {
    aboutModal.style.display = "flex";
}

function onAboutClose(event) {
    if (event.target != aboutModal) return;
    aboutModal.style.display = "none";
}

window.addEventListener("load", init)
inputField.addEventListener("input", onInputChange);
aboutButton.addEventListener("click", onAboutOpen);
aboutModal.addEventListener("click", onAboutClose);
