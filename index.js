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
let prevSelectedCells = []; // Keep track of previously selected cells
let PrevHighlightedRowsAndColumns = []; //keep track of corresponding rows and col highlighted
let prevselectedBorders = [];

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
    // console.log(row , col)
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute("spellcheck", "false");

    // Attributes for cell identification
    cell.setAttribute("rowid", row);
    cell.setAttribute("colid", col);
    // console.log(cell);
    cell.innerText = "";
    // console.log(cell.innerText)

    cell.addEventListener('click', handlecellClick);

    cell.addEventListener('dblclick', (e) => {
        cell.setAttribute("contenteditable", "true");
        cell.focus();
    });

    selectMultipleCells(cell);
    return cell;
}

function handlecellClick(event) {
    console.log('line 74', event.target)
    const targetcell = event.target
    console.log(targetcell)
    currentRow = targetcell.getAttribute('rowid') //rowid and colid is same as row and col which we have passed in argument 
    currentCol = targetcell.getAttribute('colid')
    console.log(currentRow, currentCol);
    setFocusAndHighlight(targetcell, currentRow, currentCol, true, true);
}


function selectMultipleCells(cell) {
    // console.log('line 98',cell)
    // console.log(cell.getAttribute('rowid'));
    // console.log(cell.getAttribute('colid'));
    cell.addEventListener('mousedown', (event) => {
        event.preventDefault();
        // cell.classList.add('border')
        isSelecting = true;
        removePreviousSelections();
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
        addBordersToSelectedCells(startCell, endCell);
    });
}

function removePreviousSelections() {
    if (prevselectedBorders) {
        prevselectedBorders.forEach((borderCell) => {
            borderCell.classList.remove('border-top', 'border-right', 'border-left', 'border-bottom')
        });
    }
    if (prevfocusedCell) prevfocusedCell.classList.remove('border');
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
    if (PrevHighlightedRowsAndColumns) {
        PrevHighlightedRowsAndColumns.forEach((rowsAndCol) => {
            rowsAndCol.classList.remove('highlight-row');
            rowsAndCol.classList.remove('highlight-col');
        });
    }
}

function addBordersToSelectedCells(startCell, endCell) {
    console.log(startCell);
    console.log(endCell);

    if (startCell !== endCell) {
        let startrowid = parseInt(startCell.getAttribute('rowid'));
        let endrowid = parseInt(endCell.getAttribute('rowid'));
        let startcolid = parseInt(startCell.getAttribute('colid'))
        let endcolid = parseInt(endCell.getAttribute('colid'));

        //if startrow is greater than endrow we select from /we will start selecting from down and go up and stretch left
        if (startrowid > endrowid) {
            for (let i = startrowid; i >= endrowid; i--) {   //6=> 2  and col 5 => 3
                const Allrows = document.getElementsByClassName("rowELement");
                const row = Allrows[i];
                const col = row.querySelectorAll('.cell');

                //inner loop start for columns
                for (let j = startcolid; j >= endcolid; j--) {
                    if (i === startrowid) { //if i === 5 or whatever wehn i starts
                        col[j].classList.add('border-bottom');
                        prevselectedBorders.push(col[j]) ////push the element in array so that next time this can be removed
                    }

                    if (i === endrowid) {
                        col[j].classList.add('border-top');//push the element in array so that next time this can be removed
                        prevselectedBorders.push(col[j])
                    }

                    if (j === startcolid) {
                        col[j].classList.add('border-right');//push the element in array so that next time this can be removed
                        prevselectedBorders.push(col[j])
                    }

                    if (j === endcolid) {
                        col[j].classList.add('border-left');//push the element in array so that next time this can be removed
                        prevselectedBorders.push(col[j])
                    }
                }
            }
        }

        // we will start selecting from down and go up and stretch right
        if (startrowid > endrowid) {
            for (let i = startrowid; i >= endrowid; i--) {   //6=> 2  and col 5 => 3
                const Allrows = document.getElementsByClassName("rowELement");
                const row = Allrows[i];
                const col = row.querySelectorAll('.cell');

                //inner loop start
                for (let j = startcolid; j <= endcolid; j++) {
                    if (i === startrowid) {
                        col[j].classList.add('border-bottom');
                        prevselectedBorders.push(col[j]) ////push the element in array so that next time this can be removed
                    }

                    if (i === endrowid) {
                        col[j].classList.add('border-top');//push the element in array so that next time this can be removed
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



        //first conditiion
        // we will start selecting from upside and go down and stretch left
        if (startrowid < endrowid && startcolid > endcolid) {

            //outer loop start
            for (let i = startrowid; i <= endrowid; i++) {   //3=> 8  and col 5 => 3
                const Allrows = document.getElementsByClassName("rowELement");
                const row = Allrows[i];
                const col = row.querySelectorAll('.cell');

                //inner loop start
                for (let j = startcolid; j >= endcolid; j--) {
                    if (i === startrowid) {
                        col[j].classList.add('border-top');
                        prevselectedBorders.push(col[j]) ////push the element in array so that next time this can be removed
                    }

                    if (i === endrowid) {
                        col[j].classList.add('border-bottom');//push the element in array so that next time this can be removed
                        prevselectedBorders.push(col[j])
                    }

                    if (j === startcolid) {
                        col[j].classList.add('border-right');//push the element in array so that next time this can be removed
                        prevselectedBorders.push(col[j])
                    }

                    if (j === endcolid) {
                        col[j].classList.add('border-left');//push the element in array so that next time this can be removed
                        prevselectedBorders.push(col[j])
                    }
                }
            }
        }
        //default conditon where we select right side start from top to bottom and go right side selecting the cells
        ////we can use this below or above seperate function for this condition => when start and end row is same means 8 =>8 but col is 5 => 3but startcol is bigger than endcol means we go left side or default right side
        else {
            for (let i = startrowid; i <= endrowid; i++) {
                //access the row 
                const Allrows = document.getElementsByClassName("rowELement");
                const row = Allrows[i];
                const col = row.querySelectorAll('.cell');

                for (let j = startcolid; startcolid > endcolid ? j >= endcolid : j <= endcolid; startcolid > endcolid ? j-- : j++) {
                    if (i === startrowid) {
                        col[j].classList.add('border-top');
                        prevselectedBorders.push(col[j]) ////push the element in array so that next time this can be removed
                    }

                    if (i === endrowid) {
                        col[j].classList.add('border-bottom');//push the element in array so that next time this can be removed
                        prevselectedBorders.push(col[j])
                    }

                    //wehn we are moving left side we will apply border to right of startcol and left of endcol 
                    if (j === startcolid) {
                        if (startcolid > endcolid) {
                            col[j].classList.add('border-right')
                        }
                        else if (startcolid < endcolid) {
                            col[j].classList.add('border-left');//push the element in array so that next time this can be removed
                        }
                        prevselectedBorders.push(col[j]);
                    }

                    //if we are moving right side we will apply border to left of startcol and right of endcol
                    if (j === endcolid) {
                        if (startcolid > endcolid) {
                            col[j].classList.add('border-left')
                        }
                        else if (startcolid < endcolid) {
                            col[j].classList.add('border-right');//push the element in array so that next time this can be removed
                        }
                        prevselectedBorders.push(col[j])
                    }
                }
            }
        }
    }
}


function highlightSelectedCells(startCell, endCell) {
    //removing the border when we start to select next round of cells
    if (prevfocusedCell) {
        prevfocusedCell.classList.remove('border');
    }
    console.log('function runs');
    console.log(`startCell`, startCell);
    console.log(`endCell`, endCell);
    startCell.classList.add('border'); // add focus and border to startcell wehn we start selecting multiple cells
    prevfocusedCell = startCell; // push this to prevfocused so next time the focus can be removed
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

    //remove the corresponding numbers and letters bg if we go reverse or just drag selection here and there
    if (PrevHighlightedRowsAndColumns) {
        PrevHighlightedRowsAndColumns.forEach((rowsAndCol) => {
            rowsAndCol.classList.remove('highlight-row');
            rowsAndCol.classList.remove('highlight-col');
        });
    }


    //we will start selecting from down and go up and stretch left
    if (startrowid > endrowid) { //if startrow is greater thn end like 7 =>2 but it goes left side and startcol is greater then end like is 4=>2
        for (let i = startrowid; i >= endrowid; i--) {   //7=> 2
            const Allrows = document.getElementsByClassName("rowELement")
            const row = Allrows[i];
            const col = row.querySelectorAll('.cell');

            for (let j = startcolid; j >= endcolid; j--) { //4=>2
                col[j].classList.add('background_highlight'); //access the cell 
                highlightCorrespondingRowAndColumn(i, j); //on every iteration loop will run and call this function wiht the current i and j value which will add bg-selected to corresponding rownumbers and letters
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
                highlightCorrespondingRowAndColumn(i, j); //on every iteration loop will run and call this function wiht the current i and j value which will add bg-selected to corresponding rownumbers and letters
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
                highlightCorrespondingRowAndColumn(i, j); //on every iteration loop will run and call this function wiht the current i and j value which will add bg-selected to corresponding rownumbers and letters
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
    //             highlightCorrespondingRowAndColumn(i, j); //on every iteration loop will run and call this function wiht the current i and j value which will add bg-selected to corresponding rownumbers and letters
    //             prevSelectedCells.push(col[j])//push all the cells which need to be wiped out in next iteration
    //         }
    //     }
    // }

    //we can use this below or above seperate function for this condition => when start and end row is same but startcol is bigger than endcol means we go left side
    else {
        //startrow is less than end and also startcol is less than end ex: row 3=>9 and col 3=>5
        for (let i = startrowid; i <= endrowid; i++) {   //0  i<=2 ;i++ , i=2; i<=0; i++
            //access the row 
            const Allrows = document.getElementsByClassName("rowELement")
            const row = Allrows[i];
            const col = row.querySelectorAll('.cell');

            for (let j = startcolid; startcolid > endcolid ? j >= endcolid : j <= endcolid; startcolid > endcolid ? j-- : j++) {
                col[j].classList.add('background_highlight'); //access the cell 
                highlightCorrespondingRowAndColumn(i, j); //on every iteration loop will run and call this function wiht the current i and j value which will add bg-selected to corresponding rownumbers and letters
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
//         highlightCorrespondingRowAndColumn(i, j); //on every iteration loop will run and call this function wiht the current i and j value which will add bg-selected to corresponding rownumbers and letters
//         prevSelectedCells.push(col[j])//push all the cells which need to be wiped out in next iteration
//     }
// }




function highlightCorrespondingRowAndColumn(i, j) {
    //highlightCorrespondingRowAndColumn

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
    PrevHighlightedRowsAndColumns.push(rowtohighlight, columnTohighlight);
    // console.log('line 167', prevselectedbg)
}




// render blank cells
// function renderGridLayout() {
//     const fragment = document.createDocumentFragment();
//     for (let row = 0; row < Totalrows; row++) {
//         const rowElement = document.createElement('div');
//         rowElement.classList.add('rowELement');

//         for (let col = 0; col < Totalcols; col++) {
//             const cell = createcell(row, col); //call create cell to create cell elements
//             rowElement.appendChild(cell);
//         }
//         fragment.appendChild(rowElement)
//     }
//     scrollableContent.appendChild(fragment)
// }

function renderGridLayout() {
    for (let row = 0; row < Totalrows; row++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('rowELement');

        //inner loop j runs 26times for every row i
        for (let col = 0; col < Totalcols; col++) {
            const cell = createcell(row, col); //call create cell to create cell elements
            rowElement.appendChild(cell);
        }
        scrollableContent.appendChild(rowElement)
    }
}

renderGridLayout();



function setFocusAndHighlight(cell, row, col, highlightrow, hightlightcolumn) {
    console.log(cell, row, col, highlightrow, hightlightcolumn);
    if (prevfocusedCell) {
        console.log(prevfocusedCell)
        prevfocusedCell.classList.remove('border');
        prevfocusedCell.removeAttribute("contenteditable");
        prevfocusedCell.blur() //remove focus from prev cell once next cell is clicked
        prevfocusedCell.classList.remove('background_highlight') //remove the highlight bg color when we click on different cell
    }
    cell.classList.add('border');

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
    console.log(prevfocusedCell)
    //added this two lines of code so that we get the updated row and col when do arrow down ,up and prev it was fetching the same global row can col which was 1 when first time clciked and fetch the correct cell based on row and col
    currentRow = cell.getAttribute('rowid');
    currentCol = cell.getAttribute('colid');
}

function handleTyping(event, cell) {
    if (event.key !== 'Enter' && event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
        cell.setAttribute("contenteditable", "true");
        cell.focus();
        console.log(cell.innerText);
        // if (cell.innerText.length > )
    }
}

function handleKeyboardClick(event, row, col) {
    console.log(row, col);
    let nextcell;
    let currentRow;
    let nextrow;

    switch (event.key) {
        case 'Enter':
            event.preventDefault();
            console.log('helo from handlekeyboardclck swicth case')
            console.log(prevfocusedCell)
            currentRow = prevfocusedCell.parentElement;
            nextrow = currentRow.nextElementSibling //get the next row in which cells need to focus

            if (nextrow) {
                const cellsincurentRow = nextrow.querySelectorAll('.cell'); //get all the cells in the row 
                if (cellsincurentRow) {
                    const currentcellToFocus = cellsincurentRow[col] //focus on the cell
                    console.log(currentcellToFocus)
                    setFocusAndHighlight(currentcellToFocus, ++row, col, true, false);
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
            handleTyping(event, prevfocusedCell);
    }
}

