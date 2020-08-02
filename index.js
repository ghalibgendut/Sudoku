// Load boards

const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

// Variables
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;


window.onload = () => {
    // Run 'Create New Game'
    id(`start-btn`).addEventListener(`click`, startGame);

    // Add event listener to number-container
    for (let i = 0; i < id(`number-container`).children.length; i++) {
        id(`number-container`).children[i].addEventListener(`click`, function(){
            // Check selecting not disabled
            if (!disableSelect) {
                // if number already selected
                if (this.classList.contains(`selected`)) {
                    this.classList.remove(`selected`);
                    selectedNum = null;
                }
                else {
                    for (let i = 0; i < 9; i++) {
                        id(`number-container`).children[i].classList.remove(`selected`);
                    }
                    this.classList.add(`selected`);
                    selectedNum = this;
                    updateMove();
                }
            }
        });
        
    }
}

let startGame = () => {
    // Board Difficulty
    let board;

    // EASY
    if (id(`diff-1`).checked) {
        // console.log(`Masuk ke Easy`);
        board = easy[0];
    }
    // MEDIUM
    else if(id(`diff-2`).checked) {
        // console.log(`Masuk ke Medium`);
        board = medium[0];
    }
    // HARD
    else {
        board = hard[0];
    }


    // Lives
    lives = 3;
    disableSelect = false;
    id(`lives`).textContent = `Live Remaining ${lives}`;

    // Generate board based on Difficulty
    generateBoard(board);
    
    // Start the timer
    startTimer();

    // Show number container
    id(`number-container`).classList.remove(`hidden`);
}

let startTimer = () => {
    // Set Timer based on input
    if (id(`time-1`).checked) {
        timeRemaining = 180;
    }
    else if(id(`time-2`).checked) {
        timeRemaining = 300;
    }
    else {
        timeRemaining = 600;
    }

    // Set timer for first second
    id(`timer`).textContent = timeConversion(timeRemaining);

    // set timer to update every second
    timer = setInterval(() => {
        timeRemaining --;

        if (timeRemaining === 0) {
            endGame();
        }
        id(`timer`).textContent = timeConversion(timeRemaining);
    }, 1000)
}

// Convert time
let timeConversion = (time) => {
    let minutes = Math.floor(time/60);
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let seconds = time % 60;
    if (seconds < 10) {
        seconds = `0${seconds}`
    }

    return minutes + ":" + seconds;
}


let generateBoard = (board) => {
    // Clear previous board
    clearPrevious();

    // increment tile by id
    let idCount = 0;
    for (let i = 0; i < 81; i++) {
        //  Create new paraghraph
        let tile = document.createElement('p');
        
        // Check "-"
        if (board.charAt(i) != "-") {
            tile.textContent = board.charAt(i);
        }
        else {
            // click event listener to tile
            tile.addEventListener(`click`, ()=>{
                // if selected
                if (!disableSelect) {
                    // if tile alreadey selected
                    if (tile.classList.contains(`selected`)) {
                        tile.classList.remove(`selected`);
                        selectedTile = null;
                    }
                    else {
                        for (let i = 0; i < 81; i++) {
                            qsa('.tile')[i].classList.remove(`selected`);
                        }
                    }

                    // Add selection and update variable
                    tile.classList.add(`selected`);
                    selectedTile = tile;
                    updateMove();
                }
            })
        }

        // Assign tile id
        tile.id = idCount;

        // increment tile
        idCount ++;

        // add tile class
        tile.classList.add(`tile`);
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add(`bottomBorder`);
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add(`rightBorder`);
        }

        // Add tile to border
        id(`board`).appendChild(tile);

    }
}


let updateMove = () => {
    if (selectedTile && selectedNum) {
        selectedTile.textContent = selectedNum.textContent;

        if (checkCorrect(selectedTile)) {
            selectedTile.classList.remove(`selected`);
            selectedNum.classList.remove(`selected`);
            // Clear selected variables
            selectedTile = null;
            selectedNum = null;
            if (checkDone()) {
                endGame();
            }
        }
        else {
            disableSelect = true;
            selectedTile.classList.add(`incorrect`);
            setTimeout(()=>{
                lives --;
                if (lives == 0) {
                    endGame();
                }
                else{
                    id(`lives`).textContent = `Lives Remaining: ${lives}`;
                    disableSelect = false;
                }
                // Restore tile color
                selectedTile.classList.remove(`incorrect`);
                selectedTile.classList.remove(`selected`);
                selectedNum.classList.remove(`selected`);

                // Clear Variables in selectedTile
                selectedTile.textContent = '';
                selectedTile = null;
                selectedNum = null;

            }, 1000)
        }
    }
}

let endGame = () => {
    disableSelect = true;
    clearTimeout(timer);
    if (lives == 0 || timeRemaining == 0) {
        id(`lives`). textContent = "You Lose!";
    }
    else {
        id(`lives`).textContent = "You Win!";
    }
}

let checkDone = () => {
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        if (tile.textContent == '') {
            return false;
        }
        return true;
    }
}

let checkCorrect = (tile) => {
    let solution;
    // EASY
    if (id(`diff-1`).checked) {
        // console.log(`Masuk ke Easy`);
        solution = easy[1];
    }
    // MEDIUM
    else if(id(`diff-2`).checked) {
        // console.log(`Masuk ke Medium`);
        solution = medium[1];
    }
    // HARD
    else {
        solution = hard[1];
    }

    // Check tile number = solution
    if (solution.charAt(tile.id) == tile.textContent) {
        return true;
    }
    else {
        return false;
    }
}

let clearPrevious = () => {
    // Access all tiles
    let tiles = qsa(`.tile`);

    // Remove each tile
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }

    // Clear Timer
    if (timer) {
        clearTimeout(timer);
    }

    // Diselect any numbers
    for (let i = 0; i < id(`number-container`).children.length; i++) {
        id(`number-container`).children[i].classList.remove(`selected`);
    }

    // Clear selected variables
    selectedTile = null;
    selectedNum = null;
}


// Helper Functions
let id = (id) => {
    return document.getElementById(id);
}

let qs = (selector) => {
    return document.querySelector(selector);
}

let qsa = (selector) => {
    return document.querySelectorAll(selector);
}