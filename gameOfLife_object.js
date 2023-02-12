const unitLength = 20; // boxes' width and height
let boxColor = 150;
const strokeColor = '#FF0000';
let hoverColor = '#00FF00' /* [Math.random() * 255, Math.random() * 255, Math.random() * 255] */
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let board

let slider
let gameSpeedValue

let isPause = false
let colorPicker
let isResetColor = false

let keyboardCursorX
let keyboardCursorY
let isKeyboardReset = true
let deployBox

let rule1Value
let rule2Value
let rule3Value
let isRule3Changed

let selectPattern
// let customPattern
let pattern
let isPatternGenerate
let isInputCustomPattern = false

let patternBoard
let maxCol
let maxRow
let isMousePressed

const patternPreview = document.querySelector('#pattern-preview-container')
const gosperGliderGun = document.querySelector('.gosper-glider-gun')
const glider = document.querySelector('.glider')
const lightweightSpaceship = document.querySelector('.lightweight-spaceship')


function setup() {
    /* Set the canvas to be under the element #canvas*/

    const canvas = createCanvas(windowWidth - 50, windowHeight - 200);
    canvas.parent(document.querySelector('#canvas'));

    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength); // width === canvas's width; result === number of columns
    rows = floor(height / unitLength); // height === canvas's height; result === number of rows

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    board = [];
    // nextBoard = [];
    for (let i = 0; i < columns; i++) {
        board[i] = [];
        // nextBoard[i] = []
    }

    // Now both currentBoard and nextBoard are array of array of undefined values.
    init();  // Set the initial values of the currentBoard and nextBoard

    // implement game speed slider
    slider = createSlider(5, 10, 5, 0.5)
    // slider.position(30, 150)
    slider.style('width', '10.8vw')
    slider.style('margin-right', '10px')
    slider.input(showSliderValue)
    slider.parent(document.querySelector('.game-speed-slider'))

    // implement game speed value textbox
    gameSpeedValue = createInput('')
    // gameSpeedValue.position(30, 170)
    // gameSpeedValue.size(50)
    gameSpeedValue.parent(document.querySelector('.game-speed-textbox'))

    // initialise the game speed value textbox with value relative to slider
    gameSpeedValue.value(slider.value() * 20)

    // implement submit button for the game speed value textbox
    let submitButton = createButton('Submit')
    // submitButton.position(gameSpeedValue.x + gameSpeedValue.width + 10, gameSpeedValue.y)
    submitButton.mousePressed(updateValue)
    submitButton.parent(document.querySelector('.game-speed-submit'))

    //initialise the game speed
    frameRate(5);

    // implement color picker to change the box color
    colorPicker = createColorPicker('#65829F')
    colorPicker.parent(document.querySelector('.color-picker-ui'))

    // implement default color button for the color picker
    let defaultColorButton = createButton('Default')
    // defaultColorButton.position(colorPicker.x + colorPicker.width + 10, colorPicker.y)
    defaultColorButton.mousePressed(resetColor)
    defaultColorButton.parent(document.querySelector('.color-picker-ui'))

    // implement first rule customisation
    rule1Value = createInput('')
    rule1Value.size(30)
    rule1Value.parent(document.querySelector('.rule1-part1'))
    rule1Value.value(2)

    // implement second rule customisation
    rule2Value = createInput('')
    rule2Value.size(30)
    rule2Value.parent(document.querySelector('.rule2-part1'))
    rule2Value.value(3)

    // implement third rule customisation
    rule3Value = createInput('')
    rule3Value.size(30)
    rule3Value.parent(document.querySelector('.rule3-part1'))
    rule3Value.value(3)

    // implement pattern selection
    selectPattern = createSelect()
    selectPattern.option('-')
    selectPattern.option('Gosper Glider Gun')
    selectPattern.option('Glider')
    selectPattern.option('Lightweight Spaceship')
    selectPattern.option('Custom Pattern')
    selectPattern.changed(patternPreviews)
    selectPattern.parent(document.querySelector('.pattern-selector'))
    // customPattern = createInput('')
    // customPattern.size(187, 150)
    // customPattern.parent(document.querySelector('.pattern-ui'))
    // customPattern.value('')

    startOrPauseButton()

    resetRules()

    resetGame()

    randomGenerate()
}

function init() {
    // create rows and assign value into the arr representing empty boxes 
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            board[i][j] = { curState: 0, nextState: 0};
            // nextBoard[i][j] = {value: 0};
        }
    }

    // input initial boxes colored (if any)
}

function showSliderValue() {
    // when the slider moves, the game speed value will change with it
    gameSpeedValue.value(slider.value() * 20)
}

function updateValue() {
    // when the game speed value changes, the slider will update the changes
    slider.value(gameSpeedValue.value() / 20)
}

function resetColor() {
    colorPicker.value('#65829F')
    isResetColor = true
    setTimeout(() => isResetColor = false, 10)
}

function startOrPauseButton() {
    const startOrPause = document.querySelector('#start-pause')
    startOrPause.addEventListener('click', () => {
        if (isPause) {
            startOrPause.textContent = 'Pause'
            isPause = false
        } else {
            startOrPause.textContent = 'Start'
            isPause = true
        }
    })
}

function resetRules() {
    const resetRulesButton = document.querySelector('.default-rules')
    resetRulesButton.addEventListener('click', () => {
        rule1Value.value(2)
        rule2Value.value(3)
        rule3Value.value(3)
    })
}

function resetGame() {
    const resetButton = document.querySelector('#reset-button')
    resetButton.addEventListener('click', () => init())
}

function randomGenerate() {
    const randomButton = document.querySelector('#random-button')
    randomButton.addEventListener('click', () => {
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                board[i][j].curState = floor(Math.random() * 2);
            }
        }
    })
}

function draw() {
    background('#123456');
    generate();

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            fill(board[i][j].curState === 1 ? board[i][j].color = colorPicker.color() : 255) // determine the box color
            stroke(strokeColor); // border color
            rect(i * unitLength, j * unitLength, unitLength, unitLength); // generate boxes
        }
    }

    mouseCursor()

    // implement slider change
    let value = slider.value()
    frameRate(value)

    // press W key to move preview box up and stop when it is at the boundary
    if (keyIsDown(87) && (isInputCustomPattern === false)) {
        if (keyboardCursorY === 0) {
            fill([random() * 255, random() * 255, random() * 255])
            stroke(strokeColor)
            rect(keyboardCursorX * unitLength, keyboardCursorY * unitLength, unitLength, unitLength)
            return
        } else {
            keyboardCursorY--
            fill([random() * 255, random() * 255, random() * 255])
            stroke(strokeColor)
            rect(keyboardCursorX * unitLength, keyboardCursorY * unitLength, unitLength, unitLength)
        }
        isKeyboardReset = false
    }

    // press A key to move preview box to the left and stop when it is at the boundary
    else if (keyIsDown(65) && (isInputCustomPattern === false)) {
        if (keyboardCursorX === 0) {
            fill([random() * 255, random() * 255, random() * 255])
            stroke(strokeColor)
            rect(keyboardCursorX * unitLength, keyboardCursorY * unitLength, unitLength, unitLength)
            return
        } else {
            keyboardCursorX--
            fill([random() * 255, random() * 255, random() * 255])
            stroke(strokeColor)
            rect(keyboardCursorX * unitLength, keyboardCursorY * unitLength, unitLength, unitLength)
        }
        isKeyboardReset = false
    }

    // press S key to move preview box down and stop when it is at the boundary
    else if (keyIsDown(83) && (isInputCustomPattern === false)) {
        if (keyboardCursorY === (rows - 1)) {
            fill([random() * 255, random() * 255, random() * 255])
            stroke(strokeColor)
            rect(keyboardCursorX * unitLength, keyboardCursorY * unitLength, unitLength, unitLength)
            return
        } else {
            keyboardCursorY++
            fill([random() * 255, random() * 255, random() * 255])
            stroke(strokeColor)
            rect(keyboardCursorX * unitLength, keyboardCursorY * unitLength, unitLength, unitLength)
        }
        isKeyboardReset = false
    }

    // press D key to move preview box to the right and stop when it is at the boundary
    else if (keyIsDown(68) && (isInputCustomPattern === false)) {
        if (keyboardCursorX === (columns - 1)) {
            fill([random() * 255, random() * 255, random() * 255])
            stroke(strokeColor)
            rect(keyboardCursorX * unitLength, keyboardCursorY * unitLength, unitLength, unitLength)
            return
        } else {
            keyboardCursorX++
            fill([random() * 255, random() * 255, random() * 255])
            stroke(strokeColor)
            rect(keyboardCursorX * unitLength, keyboardCursorY * unitLength, unitLength, unitLength)
        }
        isKeyboardReset = false
    }

    // press space key to deploy box at the preview location
    if (keyIsDown(32) && (isInputCustomPattern === false)) {
        if (isKeyboardReset) {
            return
        } else {
            board[keyboardCursorX][keyboardCursorY].curState = 1
            fill(colorPicker.color())
            stroke(strokeColor)
            rect(keyboardCursorX * unitLength, keyboardCursorY * unitLength, unitLength, unitLength)
            deployBox = true
        }
    } else {
        deployBox = false
    }

    // keep the preview box stay in hover color
    keyReleased()

    // keep the preview box stay empty
    if (isKeyboardReset) {
        fill(255)
        stroke(strokeColor)
        rect(keyboardCursorX * unitLength, keyboardCursorY * unitLength, unitLength, unitLength)
    }

    changeRule3()

    mouseHover()

    textareaHidden()
}

function generate() {
    // when deploy box and pause stop the rules
    if (deployBox || isPause || isRule3Changed || isPatternGenerate || isMousePressed) {
        return
    }

    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += board[(x + i + columns) % columns][(y + j + rows) % rows].curState;
                    // console.log(x, y, neighbors)
                }
            }

            // Rules of Life
            if (board[x][y].curState == 1 && neighbors < rule1Value.value()) {
                // Die of Loneliness
                // console.log('rule1')
                board[x][y].nextState = 0;
            } else if (board[x][y].curState == 1 && neighbors > rule2Value.value()) {
                // Die of Overpopulation
                // console.log('rule2')
                board[x][y].nextState = 0;
            } else if (board[x][y].curState == 0 && neighbors == rule3Value.value()) {
                // New life due to Reproduction
                // console.log('rule3')
                board[x][y].nextState = 1;
                } else {
                    // Stasis
                    // console.log('rule4')
                    // console.log(neighbors)
                    // let jsonCurState = JSON.stringify(board[x][y].curState)
                    // let jsonNextState = JSON.stringify(board[x][y].nextState)
                    // board[x][y].nextState = JSON.parse(jsonCurState)
                    // board[x][y].curState = JSON.parse(jsonNextState)
                    board[x][y].nextState = board[x][y].curState;
                }
            }
        }
        
            board.map((item) => {
            // console.log(item)
            if (item.curState === undefined || item.nextState === undefined){
                return
            } else {
            // let jsonCurState = JSON.stringify(item.curState)
            // let jsonNextState = JSON.stringify(item.nextState)
            // item.nextState = JSON.parse(jsonCurState)
            // item.curState = JSON.parse(jsonNextState)
            item.curState = item.nextState
            }})
            // item.curState = 0
        // })
        
        
        // Swap the nextBoard to be the current Board
        // board = [nextBoard, currentBoard];
    }
// }
function mouseCursor() {
    // place a cannot deploy symbol on the cursor when it is out of bound
    if (mouseX > unitLength * columns || mouseY > unitLength * rows || mouseX < 0 || mouseY < 0) {
        cursor('not-allowed')
    } else {
        cursor('pointer')
    }
}

function keyPressed() {
    if (isInputCustomPattern) {
        return
    }
    // when enter is pressed, submit game speed value
    if (keyCode === ENTER) {
        updateValue()
    }

    // when W, A, S or D key is pressed, initialise the position of deployment
    if (keyCode === 87 || keyCode === 83 || keyCode === 65 || keyCode === 68) {
        if (isKeyboardReset) {
            keyboardCursorX = floor(columns / 2)
            keyboardCursorY = floor(rows / 2)
        }
    }

    // when R key is pressed, deploy preview reset to empty box
    if (keyCode === 82) {
        if (isKeyboardReset) {
            return
        } else {
            isKeyboardReset = true
            fill(255)
            stroke(strokeColor)
            rect(keyboardCursorX * unitLength, keyboardCursorY * unitLength, unitLength, unitLength)
            keyboardCursorX = null
            keyboardCursorY = null
        }
    }
}

function keyReleased() {
    // when reset key is not pressed, the preview box stay hover color
    if (isKeyboardReset) {
        return
    } else {
        fill([random() * 255, random() * 255, random() * 255])
        stroke(strokeColor)
        rect((keyboardCursorX + columns) % columns * unitLength, (keyboardCursorY + rows) % rows * unitLength, unitLength, unitLength)
    }
}

function changeRule3() {
    if (rule3Value.value() === '' || rule3Value.value() === '0') {
        isRule3Changed = true
    } else {
        isRule3Changed = false
    }
}

function mouseHover() {
    if (mouseX > unitLength * columns - 1 || mouseY > unitLength * rows - 1 || mouseX < 0 || mouseY < 0 || !isKeyboardReset) {
        return;
    }

    const mouseCol = floor(mouseX / unitLength)
    const mouseRow = floor(mouseY / unitLength)
    if (mouseX === 0 && mouseY === 0) {
        fill(255);
        stroke(strokeColor);
        rect(mouseCol * unitLength, mouseRow * unitLength, unitLength, unitLength)
    } else if (selectPattern.value() !== '-') {
        patternsGenerator()
        for (let i = 0; i < maxCol; i++) {
            for (let j = 0; j < maxRow; j++) {
                fill([random() * 255, random() * 255, random() * 255]);
                stroke(strokeColor);
                // rect((i + floor(x - maxCol / 2)) * unitLength, (j + floor(y - maxRow / 2)) * unitLength, unitLength, unitLength);
                if ((2 + maxCol + mouseCol) > columns || (1 + maxRow + mouseRow) > rows) {
                    return
                }
                if (patternBoard[i][j] === 1) {
                    rect((i + floor(mouseCol + 2)) * unitLength, (j + floor(mouseRow + 1)) * unitLength, unitLength, unitLength)
                }
            }
        }
    } else {
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                if (mouseCol === i && mouseRow === j) {
                    fill([random() * 255, random() * 255, random() * 255]);
                    stroke(strokeColor);
                    rect(mouseCol * unitLength, mouseRow * unitLength, unitLength, unitLength)
                }
            }
        }
    }
}

function windowResized() {
    /* Set the canvas to be under the element #canvas*/
    const canvas = createCanvas(windowWidth - 50, windowHeight - 200); // 
    canvas.parent(document.querySelector('#canvas'));

    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength); // width === canvas's width; result === number of columns
    rows = floor(height / unitLength); // height === canvas's height; result === number of rows

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */

    // create new columns for the enlarged screen size
    for (let i = 0; i < columns; i++) {
        if (!board[i]) {
            board[i] = [];
        }
    }

    // expand boards to include new columns and rows (create new rows and assign value into the arr representing empty boxes)
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (!board[i][j]) {
                board[i][j] = { curState: 0, nextState: 0 };
            }
        }
    }
}

function mouseDragged() {
    if (mouseX > unitLength * columns - 1 || mouseY > unitLength * rows - 1 || mouseX < 0 || mouseY < 0 || isPatternGenerate || !isKeyboardReset) {
        return;
    }
    const mouseCol = floor(mouseX / unitLength); // mouseX === mouse location in px on x axis
    const mouseRow = floor(mouseY / unitLength); // mouseY === mouse location in px on y axis

    board[mouseCol][mouseRow].curState = 1;
    fill([random() * 255, random() * 255, random() * 255]);
    stroke(strokeColor);
    rect(mouseCol * unitLength, mouseRow * unitLength, unitLength, unitLength);
    return true
}

function mousePressed() {
    // preventing keys not working in draw function and stop from resetting color 
    // if (isPause || isResetColor) {
    //     console.log("check2 isPause", isPause)
    // } else {
    //     noLoop();
    // }
    isMousePressed = true
    // if (!isPause || !isResetColor) {
    //     noLoop()
    // }


    if (selectPattern.value() !== '-' && isKeyboardReset) {
        isPatternGenerate = true
        patternsGenerator()
        if (mouseX > unitLength * columns - maxCol * unitLength - 1 || mouseY > unitLength * rows - maxRow * unitLength - 1 || mouseX < 0 || mouseY < 0) {
            return;
        }

        const mouseCol = floor(mouseX / unitLength); // mouseX === mouse location in px on x axis
        const mouseRow = floor(mouseY / unitLength); // mouseY === mouse location in px on y axis

        for (let i = 0; i < maxCol; i++) {
            for (let j = 0; j < maxRow; j++) {
                board[i + floor(mouseCol + 2)][j + floor(mouseRow + 1)].curState = patternBoard[i][j]
            }
        }
    } else {
        isPatternGenerate = false
    }

}

function mouseReleased() {
    loop()
    isPatternGenerate = false
    isMousePressed = false
}

function patternsGenerator() {
    if (selectPattern.value() === 'Gosper Glider Gun') {
        pattern =
            `........................O
......................O.O
............OO......OO............OO
...........O...O....OO............OO
OO........O.....O...OO
OO........O...O.OO....O.O
..........O.....O.......O
...........O...O
............OO`
    } else if (selectPattern.value() === 'Glider') {
        pattern =
            `.O
..O
OOO`
    } else if (selectPattern.value() === 'Lightweight Spaceship') {
        pattern =
            `.O..O
O
O...O
OOOO`
    } else {
        // textareaHidden()
        console.log("entering custom pattern")
        const customPattern = document.querySelector('.pattern-textarea')
        console.log("check textarea input", customPattern.value)
        // if (customPattern.value === '') {
        //     return
        // }
        console.log(patternBoard)

        customPattern.addEventListener('input', (event) => {
            console.log('hi', event.target.value)
            pattern = event.target.value
            console.log("check pattern", typeof pattern)
            isInputCustomPattern = true
        })
        if (pattern === undefined) {
            console.log('has returned')
            return
        } else if (pattern.includes('.') === false || pattern.includes('O') === false) {
            pattern = undefined
            customPattern.value = ''
            alert("Please insert pattern only with '.' and 'O'")
        }
    }

    // customPattern.addEventListener('input', (event) => {
    //     if (event.target.value === undefined) {
    //         console.log('undefeined')
    //     return
    //     } else {
    //         pattern = event.target.value
    //     }

    // })


    // pattern = customPattern.value()
    if (pattern !== undefined) {
        let patternArr;
        patternArr = pattern.split('\n')

        maxCol = patternArr.reduce((acc, cur) => {
            if (cur.length > acc) {
                acc = cur.length
            }
            return acc
        }, 0)

        maxRow = patternArr.length

        patternBoard = []
        for (let i = 0; i < maxCol; i++) {
            patternBoard[i] = []
        }

        for (let i = 0; i < maxCol; i++) {
            for (let j = 0; j < maxRow; j++) {
                if (patternArr[j][i] === 'O') {
                    patternBoard[i][j] = 1
                } else {
                    patternBoard[i][j] = 0
                }
            }
        }
    }
}

function textareaHidden() {
    const customPattern = document.querySelector('.pattern-textarea')
    if (selectPattern.value() === 'Custom Pattern'/*  && customPattern.hasAttribute('hidden') */) {
        customPattern.removeAttribute('hidden')
    } else if ((customPattern.hasAttribute('hidden') === false) && (selectPattern.value() !== 'Custom Pattern')) {
        customPattern.value = ''
        customPattern.setAttribute('hidden', '')
        isInputCustomPattern = false
    }
}

function patternPreviews() {
    if (selectPattern.value() === 'Gosper Glider Gun') {
        if (!glider.hasAttribute('hidden')) {
            glider.setAttribute('hidden', '')
        }
        if (!lightweightSpaceship.hasAttribute('hidden')) {
            lightweightSpaceship.setAttribute('hidden', '')
        }
        patternPreview.removeAttribute('hidden')
        gosperGliderGun.removeAttribute('hidden')
    } else if (selectPattern.value() === 'Glider') {
        if (!gosperGliderGun.hasAttribute('hidden')) {
            gosperGliderGun.setAttribute('hidden', '')
        }
        if (!lightweightSpaceship.hasAttribute('hidden')) {
            lightweightSpaceship.setAttribute('hidden', '')
        }
        patternPreview.removeAttribute('hidden')
        glider.removeAttribute('hidden')
    } else if (selectPattern.value() === 'Lightweight Spaceship') {
        if (!gosperGliderGun.hasAttribute('hidden')) {
            gosperGliderGun.setAttribute('hidden', '')
        }
        if (!glider.hasAttribute('hidden')) {
            glider.setAttribute('hidden', '')
        }
        patternPreview.removeAttribute('hidden')
        lightweightSpaceship.removeAttribute('hidden')
    } else {
        if (!patternPreview.hasAttribute('hidden')) {
            patternPreview.setAttribute('hidden', '')
        }
        if (!gosperGliderGun.hasAttribute('hidden')) {
            gosperGliderGun.setAttribute('hidden', '')
        }
        if (!glider.hasAttribute('hidden')) {
            glider.setAttribute('hidden', '')
        }
        if (!lightweightSpaceship.hasAttribute('hidden')) {
            lightweightSpaceship.setAttribute('hidden', '')
        }
    }
}
