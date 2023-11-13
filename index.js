const Totalrows = 100;
const Totalcols = 26;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

let prevHighlightedColumn;
let prevHighlightedRow;
let prevfocusedCell;

let currentRow;
let currentCol;

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
let prevselectedBorders = []


document.addEventListener('keydown', (event) => {
    handleKeyboardClick(event, currentRow, currentCol); //fucntion runs when keyboard buttons are pressed
});

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
    cell.classList.add('cell');
    cell.setAttribute("spellcheck", "false");

    // Attributes for cell identification
    cell.setAttribute("rowid", row);
    cell.setAttribute("colid", col);
    cell.innerText = "";

    // cell.addEventListener('keydown', (event) => {
    //     handleKeyboardClick(event, row, col); //fucntion runs when keyboard buttons are pressed
    // });

    cell.addEventListener('click', (event) => {
        console.log('line 74', event.target)
        const x = event.target
        console.log(x.getAttribute('rowid'))
        console.log(x.getAttribute('colid'))
        currentRow = x.getAttribute('rowid')
        currentCol = x.getAttribute('colid')
        console.log(row, col)
        handlecellClick(cell, row, col, true, true);
    })

    cell.addEventListener('dblclick', () => {
        cell.setAttribute("contenteditable", "true");
        cell.focus()
    });

    selectMultipleCells(cell);
    return cell;
}


function selectMultipleCells(cell) {
    // console.log('line 98',cell)
    // console.log(cell.getAttribute('rowid'));
    // console.log(cell.getAttribute('colid'));
    cell.addEventListener('mousedown', (event) => {
        event.preventDefault();
        // cell.classList.add('border')
        isSelecting = true;
        removeprevSelections();
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
        // console.log(endCell);

        addBordersToSelectedCells(startCell, endCell);
    });
}

function removeprevSelections() {
    if (prevselectedBorders) {
        prevselectedBorders.forEach((borderCell) => {
            borderCell.classList.remove('border-top', 'border-right', 'border-left', 'border-bottom')
        });
    }
    // if (prevfocusedCell) prevfocusedCell.classList.remove('border');
    if (prevHighlightedRow) {
        prevHighlightedRow.classList.remove('highlight-row');
    }
    if (prevHighlightedColumn) {
        prevHighlightedColumn.classList.remove('highlight-col');
    }

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
}

function addBordersToSelectedCells(startCell, endCell) {
    console.log(startCell, endCell);
    if (startCell !== endCell) {
        let startrowid = parseInt(startCell.getAttribute('rowid'));
        let endrowid = parseInt(endCell.getAttribute('rowid'));
        let startcolid = parseInt(startCell.getAttribute('colid'))
        let endcolid = parseInt(endCell.getAttribute('colid'));

        for (let i = startrowid; i <= endrowid; i++) {
            //access the row 
            const Allrows = document.getElementsByClassName("rowELement");
            const row = Allrows[i];
            const col = row.querySelectorAll('.cell');

            for (let j = startcolid; j <= endcolid; j++) {
                if (i === startrowid) {
                    col[j].classList.add('border-top');
                    prevselectedBorders.push(col[j]) ////push the element in array so that next time this can be removed
                }

                if (i === endrowid) {
                    col[j].classList.add('border-bottom');//push the element in array so that next time this can be removed
                    prevselectedBorders.push(col[j])
                }

                if (j === startcolid) {
                    col[j].classList.add('border-left');//push the element in array so that next time this can be removed
                    prevselectedBorders.push(col[j])
                }

                if (j === endcolid) {
                    col[j].classList.add('border-right');//push the element in array so that next time this can be removed
                    prevselectedBorders.push(col[j])
                }
            }
        }
    }
}




function highlightSelectedCells(startCell, endCell) {
    console.log('function runs');
    console.log(`startCell`, startCell)
    console.log(`endCell`, endCell);
    let startrowid = parseInt(startCell.getAttribute('rowid')); //1 =>// 2
    // console.log(parseInt(startrowid))
    console.log(startrowid)

    let endrowid = parseInt(endCell.getAttribute('rowid')); //4  => //0
    console.log(endrowid)
    let startcolid = parseInt(startCell.getAttribute('colid')) //1
    let endcolid = parseInt(endCell.getAttribute('colid')); //3

    console.log(startcolid, endcolid);

    //remove the background color if we go in reverse selection and as soon as it removes focus from where it was previoulsy there 
    if (prevSelectedCells) {
        prevSelectedCells.forEach((cells) => {
            cells.classList.remove('background_highlight');
        });
    }

    //we will start selecting from down and go up and stretch left
    if (startrowid > endrowid) { //if startrow is greater thn end like 7 =>2 but it goes left side and startcol is greater then end like is 4=>2
        console.log('helo i reachedOne')
        for (let i = startrowid; i >= endrowid; i--) {   //7=> 2
            const Allrows = document.getElementsByClassName("rowELement")
            const row = Allrows[i];
            const col = row.querySelectorAll('.cell');

            for (let j = startcolid; j >= endcolid; j--) { //4=>2
                col[j].classList.add('background_highlight'); //access the cell 
                highLightCorrespondinglettersandNumbers(i, j); //on every iteration loop will run and call this function wiht the current i and j value which will add bg-selected to corresponding rownumbers and letters
                prevSelectedCells.push(col[j])//push all the cells which need to be wiped out in next iteration
            }
        }
    }

    //we will start selecting from down and go up and stretch right
    if (startrowid > endrowid) { //if startrow is greater than endrow like row 7=>2 but it goes right side then j should be ++ ex 5 => 2 , //2 =>4
        for (let i = startrowid; i >= endrowid; i--) {   //7 => 2
            const Allrows = document.getElementsByClassName("rowELement")
            const row = Allrows[i];
            const col = row.querySelectorAll('.cell');

            for (let j = startcolid; j <= endcolid; j++) { // 2=>4
                col[j].classList.add('background_highlight'); //access the cell 
                highLightCorrespondinglettersandNumbers(i, j); //on every iteration loop will run and call this function wiht the current i and j value which will add bg-selected to corresponding rownumbers and letters
                prevSelectedCells.push(col[j])//push all the cells which need to be wiped out in next iteration
            }
        }
    }
    //we will start selecting from upside and go down and stretch left
    if (startrowid < endrowid && startcolid > endcolid) { //if startrow is less than endrow and startcol > endcol means it goes below
        for (let i = startrowid; i <= endrowid; i++) {   //3 => 8
            const Allrows = document.getElementsByClassName("rowELement");
            const row = Allrows[i];
            const col = row.querySelectorAll('.cell');

            for (let j = startcolid; j >= endcolid; j--) {  //5=>3
                col[j].classList.add('background_highlight'); //access the cell 
                highLightCorrespondinglettersandNumbers(i, j); //on every iteration loop will run and call this function wiht the current i and j value which will add bg-selected to corresponding rownumbers and letters
                prevSelectedCells.push(col[j])//push all the cells which need to be wiped out in next iteration
            }
        }
    }

    //if startrow and endrow same hoga and apn left side me stretch krege to
    // if (startrowid === endrowid && startcolid > endcolid) { //if startrow is less than endrow and startcol > endcol means it goes below
    //     for (let i = startrowid; i <= endrowid; i++) {   //3 => 8
    //         const Allrows = document.getElementsByClassName("rowELement");
    //         const row = Allrows[i];
    //         const col = row.querySelectorAll('.cell');

    //         for (let j = startcolid; j >= endcolid; j--) {  //5=>3
    //             col[j].classList.add('background_highlight'); //access the cell 
    //             highLightCorrespondinglettersandNumbers(i, j); //on every iteration loop will run and call this function wiht the current i and j value which will add bg-selected to corresponding rownumbers and letters
    //             prevSelectedCells.push(col[j])//push all the cells which need to be wiped out in next iteration
    //         }
    //     }
    // }

    //we can use this below or above seperate function for this condition => when start and end row is same but startcol is bigger than endcol means we go left side
    else {
        console.log('hello i reachedTwo');//startrow is less than end and also startcol is less than end ex: row 3=>9 and col 3=>5
        for (let i = startrowid; i <= endrowid; i++) {   //0  i<=2 ;i++ , i=2; i<=0; i++
            //access the row 
            const Allrows = document.getElementsByClassName("rowELement")
            const row = Allrows[i];
            const col = row.querySelectorAll('.cell');

            for (let j = startcolid; startcolid > endcolid ? j >= endcolid : j <= endcolid; startcolid > endcolid ? j-- : j++) {
                col[j].classList.add('background_highlight'); //access the cell 
                highLightCorrespondinglettersandNumbers(i, j); //on every iteration loop will run and call this function wiht the current i and j value which will add bg-selected to corresponding rownumbers and letters
                prevSelectedCells.push(col[j])//push all the cells which need to be wiped out in next iteration
            }
        }
    }
}




// for (let i = startrowid; startrowid > endrowid ? i >= endrowid : i <= endrowid; startrowid > endrowid ? i-- : i++) {   //0  i<=2 ;i++ , i=2; i<=0; i++
//     //access the row 
//     const Allrows = document.getElementsByClassName("rowELement")
//     const row = Allrows[i];
//     const col = row.querySelectorAll('.cell');

//     for (let j = startcolid; startrowid > endrowid ? j >= endrowid : j <= endcolid; startrowid > endrowid ? j-- : j++) {
//         col[j].classList.add('background_highlight'); //access the cell 
//         highLightCorrespondinglettersandNumbers(i, j); //on every iteration loop will run and call this function wiht the current i and j value which will add bg-selected to corresponding rownumbers and letters
//         prevSelectedCells.push(col[j])//push all the cells which need to be wiped out in next iteration
//     }
// }




function highLightCorrespondinglettersandNumbers(i, j) {

    //take out the row which u wnt to highlight
    const numberchildrens = numbers.children
    const rowtohighlight = numberchildrens[i];
    rowtohighlight.classList.add('highlight-row');
    prevHighlightedRow = rowtohighlight;

    //take out the col which u wan to highlight
    const lettersChildren = letters.children
    const columnTohighlight = lettersChildren[j];
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
    console.log(cell, row, col, highlightrow, hightlightcolumn);

    if (prevfocusedCell) {
        console.log(prevfocusedCell)
        prevfocusedCell.classList.remove('border');
        prevfocusedCell.classList.remove('background_highlight') //remove the highlight bg color when we click on different cell
    }
    cell.classList.add('border');
    console.log(cell);
    cell.focus();


    // code to highlisht the coresponding letters and numbers
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
    //added this two lines of code so that we get the updated row and col when do arrow down ,up and prev it was fetching the same global row can col which was 1 when first time clciked and fetch the correct cell based on row and col
    currentRow = cell.getAttribute('rowid');
    currentCol = cell.getAttribute('colid');
    // console.log(`clicked on  row ${row} and col ${col}`);
}


function handleKeyboardClick(event, row, col) {
    console.log(row, col)
    let nextcell;
    let currentRow;
    let nextrow;

    switch (event.key) {
        case 'Enter':
            event.preventDefault();
            console.log(prevfocusedCell)
            currentRow = prevfocusedCell.parentElement;
            nextrow = currentRow.nextElementSibling //get the next row in which cells need to focus

            if (nextrow) {
                const cellsincurentRow = nextrow.querySelectorAll('.cell'); //get all the cells in the row 
                if (cellsincurentRow) {
                    const currentelementToFocus = cellsincurentRow[col] //focus on the cell
                    console.log(currentelementToFocus)
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
            console.log(prevfocusedCell)
            console.log('col', currentCol)
            console.log('row', currentRow);
            currentRow = prevfocusedCell.parentElement
            console.log(currentRow);
            nextrow = currentRow.nextElementSibling
            console.log(nextrow);

            if (nextrow) {
                const cellsincurentRow = nextrow.querySelectorAll('.cell');
                if (cellsincurentRow) {
                    const elementTofocus = cellsincurentRow[col];
                    console.log(col)
                    console.log(elementTofocus)
                    setFocusAndHighlight(elementTofocus, ++row, col, true, false);
                }
            }
            break;

        default:
            break;
    }
}

