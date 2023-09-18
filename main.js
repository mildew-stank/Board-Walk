const inputField = document.getElementById("key");
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

const scales = {
    "major": [0, 2, 2, 1, 2, 2, 2, 1],
    "minor": [0, 2, 1, 2, 2, 1, 2, 2],
    "pentatonic major": [0, 2, 2, 3, 2, 3],
    "pentatonic minor": [0, 3, 2, 2, 3, 2],
};

function init() {
    inputField.value = "";
}

function onInputChange() {
    const commands = this.value.toLowerCase().split(" ");

    commands.length = 3;
    revertNotes();

    if (commands[0] in notes) {
        const scaleCommand = `${commands[1] || ""} ${commands[2] || ""}`.trim();
        const scale = scales[scaleCommand] || [0];

        for (let i = 0; i < strings.length; i++) {
            highlightNotesOnString(i, openNotes[i], notes[commands[0]], scale);
        }
    }
}

function revertNotes() {
    for (let string = 0; string < strings.length; string++) {
        for (let fret = 0; fret < strings[string].length; fret++) {
            setStyle(strings[string][fret], false);
        }
    }
}

function highlightNotesOnString(string, open, note, scale) {
    // TODO: add option to highlight root notes
    const offset = note - open;
    let fret = offset < 0 ? 12 + offset : offset;

    for (let i = 0; i < scale.length; i++) {
        fret += scale[i];
        fret %= 12;

        if (fret == 0) setStyle(strings[string][12], true);
        setStyle(strings[string][fret], true);
    }
}

function setStyle(element, isHighlight) {
    if (!isHighlight) {
        element.removeAttribute("style");
        return;
    }

    if (element.id == "half") {
        element.style.background = "#f39c12";
        return;
    }
    element.style.background = "#f1c40f";
}

window.onload = init;
inputField.addEventListener("input", onInputChange);
