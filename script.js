// Game Setup and Initialization
const instructions = document.getElementById('heading-instructions');
const gameContainer = document.getElementById('game-container');
const startStopButton = document.getElementById('start-stop-button');
const scoreCounter = document.getElementById('score-counter');
const timerCheckbox = document.getElementById('timer-checkbox');
const timerDisplay = document.getElementById('timer-display');
const developmentModeCheckbox = document.getElementById('development-mode-checkbox');
const finishTimeCheckbox = document.getElementById('finish-time-checkbox');
const blackAndWhiteModeCheckbox = document.getElementById('black-and-white-mode-checkbox');

let gameActive = false;
let gameWon = false;
let developmentModeActive = false;
let blackAndWhiteModeActive = false;
// finishTimeDisplay.style.visibility = 'hidden';

const colors = ["red", "blue", "green", "orange", "purple", "pink", "yellow", "cyan",
    "red", "blue", "green", "orange", "purple", "pink", "yellow", "cyan"];
const symbols = ["✔", "✖", "★", "✿", "❤", "☀", "♠", "♣", "✔", "✖", "★", "✿", "❤", "☀", "♠", "♣"];

let panelColors = [...colors];
let panelSymbols = [...symbols];

let firstPanel = null;
let secondPanel = null;
let score = 0;

// TODO 
// FIXME 
// REVIEW 
// IDEA 

// Timer Functions //


let timerInterval;
let elapsedTime = 0;
let timerRunning = false;
timerDisplay.style.visibility = 'visible';

function formatTime(seconds) { // Formats the time from seconds to HH:MM:SS
    const hrs = Math.floor(seconds / 36000);
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimer() { // Updates the timer display with the elapsed time
    elapsedTime++;
    timerDisplay.innerHTML = `<p>${formatTime(elapsedTime)}</p>`;
}

function startTimer() { // Starts the timer
    timerRunning = true;
    timerInterval = setInterval(updateTimer, 1000);
} 

function stopTimer() { // Stops the timer
    timerRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() { // Resets the timer to 00:00:00
    stopTimer();
    elapsedTime = 0;
    timerDisplay.innerHTML = `<p>${formatTime(elapsedTime)}</p>`;
}

function updateFinalResult(finalTime) { // Updates the timer display with the final result when the game is won
    console.log('Updating final result:', finalTime); // Debug log
    timerDisplay.innerHTML = `<p>Finishing time: <br><span class="final-time">${formatTime(finalTime)}</span></p>`;
} 



// Panel Interaction Functions //


let clickable = true; // Add a flag to control clicking


function checkMatch() {  //returns true or false if panel colors match
    if (blackAndWhiteModeActive) {
        return firstPanel.innerHTML === secondPanel.innerHTML;
    } else {
        return firstPanel.style.background === secondPanel.style.background;
    }
}

function checkWin() { // Checks if the game is won (all pairs found) 
    return score === 8; //returns true if max score reached and game is won
}

function handleMatch() { // Handles the logic when a mismatch is found
    firstPanel.setAttribute('data-matched', 'true'); // Mark first panel as matched
    secondPanel.setAttribute('data-matched', 'true'); // Mark second panel as matched
    firstPanel = null;
    secondPanel = null;
    score++;
    scoreCounter.innerText = score;
    if (checkWin()) {
        console.log('Win detected'); // Debug log
        // instructions.innerText = 'You won! Click the button below to play again';
        startStopButton.innerText = 'Play Again';
        updateFinalResult(elapsedTime);
        stopTimer();
    }
}

function handleMismatch() { // Handles the logic when a mismatch is found
    clickable = false; // Disable clicking
    setTimeout(() => {                          // Delay for visual feedback
        if (firstPanel !== null) {                // Check if firstPanel is selected
            if (blackAndWhiteModeActive) {
                firstPanel.innerHTML = '';
            }
            firstPanel.style.background = '';   // Reset firstPanel color
        }
        if (secondPanel !== null) {   // Check if secondPanel is selected
            if (blackAndWhiteModeActive) {
                secondPanel.innerHTML = '';
            }
            secondPanel.style.background = '';   // Reset secondPanel color
        }
        firstPanel = null;                         // Reset firstPanel for next selection
        secondPanel = null;                         // Reset secondPanel for next selection
        clickable = true; // Re-enable clicking
    }, 700);                                    // 1 second delay
}

function selectFirstPanel(panel, color, symbol) {
    firstPanel = panel;

    if (blackAndWhiteModeActive) {
        panel.style.background = 'white';
        panel.style.innerText = symbol;
    } else {
        panel.style.background = color;
    }
}

function selectSecondPanel(panel, color, symbol) {
    secondPanel = panel;
    
    if (blackAndWhiteModeActive) {
        panel.style.background = 'white';
        panel.style.innerText = symbol;
    } else {
        panel.style.background = color;
    }
}


function handlePanelClick(panel, color, symbol) { // Handles the click event on a panel
    if (!clickable) return; // Ignore clicks if not clickable
    if (panel.getAttribute('data-matched') === 'true') return; // Ignore clicks if panel is already matched

    if (firstPanel === null) {                 // If no panel has been selected yet, select the current panel as the first panel.
        selectFirstPanel(panel, color, symbol);
    } else if (secondPanel === null && panel !== firstPanel) {   // If one panel is selected and the current panel is different from the first panel, select the current panel as the second panel.
        selectSecondPanel(panel, color, symbol);

        if (checkMatch()) {                     // Check if the colors of the two selected panels match.
            handleMatch();                      // If they match, handle a successful match.
        } else {
            handleMismatch();                    // If they don't match, handle a mismatch.
        }
    }
}



// Game Logic

function startGame() { // Starts the game, initializes panels and timer

    // Initialize game state and UI
    gameActive = true;
    panelColors = [...colors];
    panelSymbols = [...symbols];
    score = 0;
    scoreCounter.innerText = score;
    startStopButton.innerText = 'Stop';
    timerDisplay.innerHTML = `<p>${formatTime(elapsedTime)}</p>`; 
    startTimer();


    for (let i = 0; i <= 15; i++) {                                         // Loop to create 16 panels
        const newPanel = document.createElement('div');                     // Create a new div element for the panel
        newPanel.className = 'game-panel';                                  // Assign the class 'game-panel' to the new div                                       
        newPanel.setAttribute('data-matched', 'false');

        let currentColorIndex = Math.floor(Math.random() * panelColors.length);  // Get a random index from the panelColors array
        const truePanelColor = panelColors[currentColorIndex];

        let currentSymbolIndex = Math.floor(Math.random() * panelSymbols.length);
        const truePanelSymbol = panelSymbols[currentSymbolIndex];

        if (developmentModeActive === true) {

            if (blackAndWhiteModeActive) {
                newPanel.textContent = truePanelSymbol;
                newPanel.style.background= 'white';
            } else {
                newPanel.textContent= truePanelColor;
                newPanel.style.color = truePanelColor;
            }
        };



        
        newPanel.addEventListener('click', () => {
            if (clickable) {
                if (blackAndWhiteModeActive) {

                    newPanel.style.background = 'white';
                    newPanel.innerHTML = `<p>${truePanelSymbol}</p>`;
                    handlePanelClick(newPanel, 'white', truePanelSymbol);
                } else {
                    newPanel.style.background = truePanelColor;
                    handlePanelClick(newPanel, truePanelColor, 'inactive');
                }
            } // Check if clickable before handling click
        });

        gameContainer.appendChild(newPanel);        
        panelColors.splice(currentColorIndex, 1); // Remove the used color from the panelColors array
        panelSymbols.splice(currentSymbolIndex, 1);
    }
}

function resetGame() { // Resets the game, clearing panels and resetting the timer

    // Reset game state and UI
    gameActive = false;
    score = 0;
    scoreCounter.innerText = score;
    resetTimer();
    stopTimer();

    const allPanels = Array.from(document.getElementsByClassName('game-panel'));
    for (const panel of allPanels) {
        panel.remove();
    }

    //Reset Button Text
    startStopButton.innerText = 'Start';
    panelColors = [...colors];
}


/// Event Listeners ///

startStopButton.addEventListener('click', () => {
    if (gameActive) {
        resetGame();
    } else {
        startGame();
    }
});
// Event listener for start/stop button to reset the game

timerCheckbox.addEventListener('change', (e) => { 
    if (e.target.checked) {
        timerDisplay.style.visibility = 'hidden';
    } else {
        timerDisplay.style.visibility  = 'visible';
    }
}); // Event listener for timer checkbox to toggle timer visibility

blackAndWhiteModeCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        blackAndWhiteModeActive = true;
        if (gameActive == true) {
            resetGame();
        };
    } else {
        blackAndWhiteModeActive = false;
        if (gameActive == true) {
            resetGame();
        };
    }
});
