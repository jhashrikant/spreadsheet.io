const rows = 100;
const cols = 26;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

let prevHighlightedColumn;
let prevHighlightedRow;
let prevfocusedCell;

const scrollableContent = document.getElementById('scrollableContent');

const numbers = document.getElementById('numbers');

const letters = document.getElementById('letters')
const emptygridsParent = document.getElementById('emptygridsParent');


//render letters from A to Z
function renderLetters() {
    for (let i = 0; i < cols; i++) {
        const cellbox = document.createElement('div');
        cellbox.classList.add('cellbox');
        cellbox.innerText = alphabet.charAt(i);
        letters.appendChild(cellbox);

        // const cellbox = $("<div />");
        // cellbox.addClass('cellbox');
        // cellbox.text(alphabet.charAt(i))
        // letters.append(cellbox)
    }
}

renderLetters();  //invoke the function


// render the numbers from 1 to 100
function renderNumbers() {
    for (let i = 0; i < rows; i++) {
        const rowNumbers = document.createElement('div');
        rowNumbers.classList.add('rowNumbers');
        rowNumbers.innerText = i + 1;
        numbers.appendChild(rowNumbers);
    }
}

renderNumbers();  //invoke the function


function createcell(i, j) {
    const cell = document.createElement('div');
    cell.classList.add('cell')
    cell.setAttribute("contenteditable", "true");
    cell.setAttribute("spellcheck", "false");

    // Attributes for cell identification
    cell.setAttribute("rowid", i);
    cell.setAttribute("colid", j);
    cell.innerText = "";

    cell.addEventListener('keydown', (event) => handleKeyboardClick(event, i, j)); //fucntion runs when keyboard buttons are pressed

    cell.addEventListener('click', () => handlecellClick(cell, i, j, true, true));
    return cell;
}


// render blank cells
function renderGridLayout() {
    for (let i = 0; i < rows; i++) {

        const rowElement = document.createElement('div');
        rowElement.classList.add('rowELement');

        for (let j = 0; j < cols; j++) {
            const cell = createcell(i, j); //call create cell to create cell elements
            rowElement.appendChild(cell);
        }
        scrollableContent.appendChild(rowElement)
    }
}

renderGridLayout();

function handlecellClick(cell, i, j, highlightrow, hightlightcolumn) {
    setFocusAndHighlight(cell, i, j, highlightrow, hightlightcolumn);
}


function setFocusAndHighlight(cell, i, j, highlightrow, hightlightcolumn) {
    if (prevfocusedCell) {
        prevfocusedCell.classList.remove('border');
    }
    cell.focus();
    cell.classList.add('border');

    if (highlightrow) {
        if (prevHighlightedRow) {
            prevHighlightedRow.classList.remove('highlight-row');
        }
        const numberchildrens = numbers.children
        const rowTohighlight = numberchildrens[i];
        rowTohighlight.classList.add('highlight-row');
        prevHighlightedRow = rowTohighlight;
    }

    if (hightlightcolumn) {
        if (prevHighlightedColumn) {
            prevHighlightedColumn.classList.remove('highlight-col');
        }
        const lettersChildren = letters.children
        const columnTohighlight = lettersChildren[j];
        columnTohighlight.classList.add('highlight-col');
        prevHighlightedColumn = columnTohighlight
    }
    prevfocusedCell = cell;
    console.log(`clicked on  row ${i} and col ${j}`);
}


function handleKeyboardClick(event, i, j) {
    let nextcell;
    let currentRow; 
    let nextrow;

    switch (event.key) {
        case 'Enter':
            event.preventDefault();
            currentRow = prevfocusedCell.parentElement;
            nextrow = currentRow.nextElementSibling //get the next row in which cells need to focus

            if (nextrow) {
                const cellsincurentRow = nextrow.querySelectorAll('.cell'); //get all the cells in the row 
                if (cellsincurentRow) {
                    const currentelementToFocus = cellsincurentRow[j] //focus on the cell
                    setFocusAndHighlight(currentelementToFocus, ++i, j, true, false);
                }
            }
            break;

        case 'ArrowRight':
            event.preventDefault();
            nextcell = prevfocusedCell.nextSibling;
            setFocusAndHighlight(nextcell, i, ++j, false, true);
            break;


        case 'ArrowLeft':
            event.preventDefault();
            nextcell = prevfocusedCell.previousSibling
            setFocusAndHighlight(nextcell, i, --j, false, true);
            break;


        case 'ArrowUp':
            event.preventDefault();
            currentRow = prevfocusedCell.parentElement
            const prevRow = currentRow.previousElementSibling
            console.log(prevRow);

            if (prevRow) {
                const cellsinprevrow = prevRow.querySelectorAll('.cell');
                if (cellsinprevrow) {
                    const elementTofocus = cellsinprevrow[j]
                    setFocusAndHighlight(elementTofocus, --i, j, true, false);
                }
            }
            break;

        case 'ArrowDown':
            event.preventDefault();
            currentRow = prevfocusedCell.parentElement
            nextrow = currentRow.nextElementSibling
            console.log(nextrow);

            if (nextrow) {
                const cellsincurentRow = nextrow.querySelectorAll('.cell');
                if (cellsincurentRow) {
                    const elementTofocus = cellsincurentRow[j];
                    setFocusAndHighlight(elementTofocus, ++i, j, true, false);
                }
            }
            break;

        default:
            break;
    }
}

