const Totalrows = 100;
const Totalcols = 26;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

let prevHighlightedColumn;
let prevHighlightedRow;
let prevfocusedCell;

const scrollableContent = document.getElementById('scrollableContent');

const numbers = document.getElementById('numbers');

const letters = document.getElementById('letters')
const emptygridsParent = document.getElementById('emptygridsParent');


let startingrow;
let startingcol;

let isSelecting = false;
let startCell, endCell;
// let prevfocused = []
let prevSelectedCells = []; // Keep track of previously selected cells
let prevselectedbg = [];




//render letters from A to Z
function renderLetters() {
    for (let i = 0; i < Totalcols; i++) {
        const cellbox = document.createElement('div');
        cellbox.classList.add('cellbox');
        cellbox.innerText = alphabet.charAt(i);
        letters.appendChild(cellbox);
    }
}

renderLetters();  //invoke the function


// render the numbers from 1 to 100
function renderNumbers() {
    for (let i = 0; i < Totalrows; i++) {
        const rowNumbers = document.createElement('div');
        rowNumbers.classList.add('rowNumbers');
        rowNumbers.innerText = i + 1;
        numbers.appendChild(rowNumbers);
    }
}

renderNumbers();  //invoke the function


function createcell(row, col) {
    const cell = document.createElement('div');
    cell.classList.add('cell')
    cell.setAttribute("contenteditable", "true");
    cell.setAttribute("spellcheck", "false");

    // Attributes for cell identification
    cell.setAttribute("rowid", row + 1);
    cell.setAttribute("colid", col + 1);
    cell.innerText = "";

    cell.addEventListener('keydown', (event) => handleKeyboardClick(event, row, col)); //fucntion runs when keyboard buttons are pressed

    cell.addEventListener('click', () => handlecellClick(cell, row, col, true, true));

    selectMultipleCells(cell);

    return cell;
}

function selectMultipleCells(cell) {
    cell.addEventListener('mousedown', (e) => {
        isSelecting = true;
        // if (prevfocusedCell) prevfocusedCell.classList.remove('border');
        if (prevHighlightedRow) {
            prevHighlightedRow.classList.remove('highlight-row');
        }
        if (prevHighlightedColumn) {
            prevHighlightedColumn.classList.remove('highlight-col');
        }
        // console.log(prevSelectedCells)
        if (prevSelectedCells) {
            prevSelectedCells.forEach((cells) => {
                cells.classList.remove('background_highlight');
            });
        }
        if (prevselectedbg) {
            prevselectedbg.forEach((bg) => {
                bg.classList.remove('highlight-row');
                bg.classList.remove('highlight-col');
            });
        }
        startCell = cell;
        endCell = cell;
    });

    cell.addEventListener('mouseenter', (e) => {
        // isSelecting = true
        if (isSelecting) {
            endCell = cell
            highlightSelectedCells(startCell, endCell);
        }
    });

    cell.addEventListener('mouseup', (e) => {
        isSelecting = false;
        console.log(endCell);
        addBordersToSelection(startCell, endCell);

    });
}

function addBordersToSelection(startCell, endCell) {
    let startrowid = parseInt(startCell.getAttribute('rowid')); 
    let endrowid = parseInt(endCell.getAttribute('rowid')); 
    let startcolid = parseInt(startCell.getAttribute('colid')) 
    let endcolid = parseInt(endCell.getAttribute('colid')); 

    for (let i = startrowid; i <= endrowid; i++) {
        //access the row 
        const Allrows = document.getElementsByClassName("rowELement");
        const row = Allrows[i - 1];
        const col = row.querySelectorAll('.cell');

        for (let j = startcolid; j <= endcolid; j++) {
            if (i === startrowid) {
                col[j - 1].classList.add('border-top');
            }

            if (i === endrowid) {
                col[j - 1].classList.add('border-bottom');
            }

            if (j === startcolid) {
                col[j - 1].classList.add('border-left');
            }

            if (j === endcolid) {
                col[j - 1].classList.add('border-right');
            }
        }
    }
}


function highlightSelectedCells(startCell, endCell) {
    console.log(`startCell`, startCell)
    console.log(`endCell`, endCell);
    let startrowid = parseInt(startCell.getAttribute('rowid')); //1
    // console.log(parseInt(startrowid))
    console.log(startrowid)

    let endrowid = parseInt(endCell.getAttribute('rowid')); //4
    console.log(endrowid)
    let startcolid = parseInt(startCell.getAttribute('colid')) //1
    let endcolid = parseInt(endCell.getAttribute('colid')); //3

    for (let i = startrowid; i <= endrowid; i++) {
        //access the row 
        const Allrows = document.getElementsByClassName("rowELement")
        const row = Allrows[i - 1];
        const col = row.querySelectorAll('.cell');

        for (let j = startcolid; j <= endcolid; j++) {
            col[j - 1].classList.add('background_highlight'); //access the cell 
            colorbg(i, j); //on every iteration loop will run and call this function wiht the current i and j value which will add bg-selected to corresponding rownumbers and letters
            prevSelectedCells.push(col[j - 1])//push all the cells which need to be wiped out in next iteration
        }
    }
}



function colorbg(i, j) {

    //take out the row which u wnt to highlight
    const numberchildrens = numbers.children
    const rowtohighlight = numberchildrens[i - 1];
    rowtohighlight.classList.add('highlight-row');
    prevHighlightedRow = rowtohighlight;

    //take out the col which u wan to highlight
    const lettersChildren = letters.children
    const columnTohighlight = lettersChildren[j - 1];
    columnTohighlight.classList.add('highlight-col');
    prevHighlightedColumn = columnTohighlight

    //push the elements as prev highlighted to remove it on next time when we click and drag
    prevselectedbg.push(rowtohighlight, columnTohighlight);
    // console.log('line 167', prevselectedbg)
}




// render blank cells
function renderGridLayout() {
    for (let row = 0; row < Totalrows; row++) {

        const rowElement = document.createElement('div');
        rowElement.classList.add('rowELement');

        for (let col = 0; col < Totalcols; col++) {
            const cell = createcell(row, col); //call create cell to create cell elements
            rowElement.appendChild(cell);
        }
        scrollableContent.appendChild(rowElement)
    }
}

renderGridLayout();

function handlecellClick(cell, row, col, highlightrow, hightlightcolumn) {
    setFocusAndHighlight(cell, row, col, highlightrow, hightlightcolumn);
}


function setFocusAndHighlight(cell, row, col, highlightrow, hightlightcolumn) {
    if (prevfocusedCell) {
        prevfocusedCell.classList.remove('border');
        prevfocusedCell.classList.remove('background_highlight') //remove the highlight bg color when we click on different cell
    }
    cell.classList.add('border');
    cell.focus();


    if (highlightrow) {
        if (prevHighlightedRow) {
            prevHighlightedRow.classList.remove('highlight-row');
        }
        const numberchildrens = numbers.children
        const rowTohighlight = numberchildrens[row];
        rowTohighlight.classList.add('highlight-row');
        prevHighlightedRow = rowTohighlight;
    }

    if (hightlightcolumn) {
        if (prevHighlightedColumn) {
            prevHighlightedColumn.classList.remove('highlight-col');
        }
        const lettersChildren = letters.children
        const columnTohighlight = lettersChildren[col];
        columnTohighlight.classList.add('highlight-col');
        prevHighlightedColumn = columnTohighlight
    }
    prevfocusedCell = cell;
    console.log(`clicked on  row ${row} and col ${col}`);
}


function handleKeyboardClick(event, row, col) {
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
                    const currentelementToFocus = cellsincurentRow[col] //focus on the cell
                    setFocusAndHighlight(currentelementToFocus, ++row, col, true, false);
                }
            }
            break;

        case 'ArrowRight':
            event.preventDefault();
            nextcell = prevfocusedCell.nextSibling;
            setFocusAndHighlight(nextcell, row, ++col, false, true);
            break;


        case 'ArrowLeft':
            event.preventDefault();
            nextcell = prevfocusedCell.previousSibling
            setFocusAndHighlight(nextcell, row, --col, false, true);
            break;


        case 'ArrowUp':
            event.preventDefault();
            currentRow = prevfocusedCell.parentElement
            const prevRow = currentRow.previousElementSibling
            console.log(prevRow);

            if (prevRow) {
                const cellsinprevrow = prevRow.querySelectorAll('.cell');
                if (cellsinprevrow) {
                    const elementTofocus = cellsinprevrow[col]
                    setFocusAndHighlight(elementTofocus, --row, col, true, false);
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
                    const elementTofocus = cellsincurentRow[col];
                    setFocusAndHighlight(elementTofocus, ++row, col, true, false);
                }
            }
            break;

        default:
            break;
    }
}

