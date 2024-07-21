// Game Setup and Initialization
const instructions = document.getElementById('heading-instructions');
const gameContainer = document.getElementById('game-container');
const startStopButton = document.getElementById('start-stop-button');
const scoreCounter = document.getElementById('score-counter');
const timerCheckbox = document.getElementById('timer-checkbox');
const timerDisplay = document.getElementById('timer-display');
const developmentModeCheckbox = document.getElementById('development-mode-checkbox');
const finishTimeCheckbox = document.getElementById('finish-time-checkbox');

let gameActive = false;
let gameWon = false;
let developmentModeActive = false;
// finishTimeDisplay.style.visibility = 'hidden';

const colors = ["red", "blue", "green", "orange", "purple", "pink", "yellow", "cyan",
    "red", "blue", "green", "orange", "purple", "pink", "yellow", "cyan"];

let panelColors = [...colors];
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

function selectFirstPanel(panel, color) {
    firstPanel = panel;
    panel.style.background = color;
}

function selectSecondPanel(panel, color) {
    secondPanel = panel;
    panel.style.background = color;
}

function checkMatch() {  //returns true or false if panel colors match
    return firstPanel.style.background === secondPanel.style.background;
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
//TODO adjust panel backgrounds 
function handleMismatch() { // Handles the logic when a mismatch is found
    clickable = false; // Disable clicking
    setTimeout(() => {                          // Delay for visual feedback
        if (firstPanel !== null) {                // Check if firstPanel is selected
            firstPanel.style.background = '';   // Reset firstPanel color
        }
        if (secondPanel !== null) {                // Check if secondPanel is selected
            secondPanel.style.background = '';   // Reset secondPanel color
        }
        firstPanel = null;                         // Reset firstPanel for next selection
        secondPanel = null;                         // Reset secondPanel for next selection
        clickable = true; // Re-enable clicking
    }, 700);                                    // 1 second delay
}

function handlePanelClick(panel, color) { // Handles the click event on a panel
    if (!clickable) return; // Ignore clicks if not clickable
    if (panel.getAttribute('data-matched') === 'true') return; // Ignore clicks if panel is already matched

    if (firstPanel === null) {                 // If no panel has been selected yet, select the current panel as the first panel.
        selectFirstPanel(panel, color);
    } else if (secondPanel === null && panel !== firstPanel) {   // If one panel is selected and the current panel is different from the first panel, select the current panel as the second panel.
        selectSecondPanel(panel, color);

        if (checkMatch()) {                     // Check if the colors of the two selected panels match.
            handleMatch();                      // If they match, handle a successful match.
        } else {
            handleMismatch();                    // If they don't match, handle a mismatch.
        }
    }
}



// Game Logic

function startGame() { // Starts the game, initializes panels and timer
    // instructions.innerText = "Match color pairs until all 16 panels are revealed";
    score = 0;
    scoreCounter.innerText = score;
    timerDisplay.innerHTML = `<p>${formatTime(elapsedTime)}</p>`; // Clear previous game's final time result


    for (let i = 0; i <= 15; i++) {                                         // Loop to create 16 panels
        const newPanel = document.createElement('div');                     // Create a new div element for the panel
        newPanel.className = 'game-panel';                                  // Assign the class 'game-panel' to the new div                                       
        newPanel.setAttribute('data-matched', 'false');
        let currentIndex = Math.floor(Math.random() * panelColors.length);  // Get a random index from the panelColors array
        const truePanelColor = panelColors[currentIndex];  
        // newPanel.style.background = 'grey';
        //TODO remove background style change if necessary

        if (developmentModeActive === true) {
            newPanel.textContent= truePanelColor;
            newPanel.style.color = truePanelColor;
        };

                         // Get the color corresponding to the random index

        
        newPanel.addEventListener('click', () => {
            if (clickable) { // Check if clickable before handling click
                newPanel.style.background = truePanelColor;
                handlePanelClick(newPanel, truePanelColor);
            }
        });

        gameContainer.appendChild(newPanel);                                 // Append the new panel to the game container
        panelColors.splice(currentIndex, 1);                                 // Remove the used color from the panelColors array
    }
}

function resetGame() { // Resets the game, clearing panels and resetting the timer

    score = 0;
    scoreCounter.innerText = score;
    resetTimer();

    if (gameActive) {                               // If the game is active, remove all panels when the button is clicked
        const allPanels = Array.from(document.getElementsByClassName('game-panel'));  // Get all panels
        for (const panel of allPanels) {
            panel.remove();                                                           // Remove each panel
        }
        startStopButton.innerText = 'Start';                                          // Change the button text to 'Start'
        gameActive = false;
        stopTimer();

        clearInterval(timerInterval);
        // Set gameActive to false to indicate the game has stopped
    } else {
        panelColors = [...colors];                                                    // If the game is not active, reset the panelColors array
        startGame();                                                                  // Start the game
        startStopButton.innerText = 'Stop';                                           // Change the button text to 'Stop'
        gameActive = true;
        startTimer();                                                        // Set gameActive to true to indicate the game is now active
    }
}


/// Event Listeners ///

startStopButton.addEventListener('click', resetGame);
// Event listener for start/stop button to reset the game

timerCheckbox.addEventListener('change', (e) => { 
    if (e.target.checked) {
        timerDisplay.style.visibility = 'hidden';
    } else {
        timerDisplay.style.visibility  = 'visible';
    }
}); // Event listener for timer checkbox to toggle timer visibility

// developmentModeCheckbox.addEventListener('change', (e) => {
//     if (e.target.checked) {
//         developmentModeActive = true;
//     } else {
//         developmentModeActive = false;
//     }
//     resetGame();
// }); // Event listener for development mode checkbox to toggle development mode




/* change log

gave each function definition a comment 

*/