let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;
let balance = 1000; // starting balance (will be changed and linked to wallet)
let betAmount = 0;  // bet

// deck functions
function newDeck() {
    const suits = ["♤", "♡", "♢", "♧"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    deck = [];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }

    deck.sort(() => Math.random() - 0.5); // shuffle
}

function drawCard() {
    return deck.pop();
}

// score function
function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    for (let card of hand) {
        if (["J", "Q", "K"].includes(card.value)) {
            score += 10;
        } else if (card.value === "A") {
            aces += 1;
            score += 11;
        } else {
            score += parseInt(card.value);
        }
    }

    while (score > 21 && aces > 0) {
        score -= 10;
        aces -= 1;
    }

    return score;
}

// game functions
function placeBet(amount) {
    if (amount > balance) {
        updateDisplay(" Insufficient funds!");
        return;
    }

    betAmount = amount;
    balance -= betAmount; 
    updateBalance();

    startGame();
}

function startGame() {
    gameOver = false;
    newDeck();
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];
    
    document.getElementById("betOptions").style.display = "none";
    document.getElementById("gameButtons").style.display = "block";
    document.getElementById("newGameButton").style.display = "none";

    updateDisplay(""); 
}

function hit() {
    if (gameOver) return;

    playerHand.push(drawCard());

    if (calculateScore(playerHand) > 21) {
        gameOver = true;
        updateDisplay(" Player busts! Dealer wins.");
        endRound();
    } else {
        updateDisplay();
    }
}

function stand() {
    if (gameOver) return;

    let playerScore = calculateScore(playerHand);
    let dealerScore = calculateScore(dealerHand);

    // 17 rule + player has better hand
    while (dealerScore < 17 || dealerScore < playerScore) {
        dealerHand.push(drawCard());
        dealerScore = calculateScore(dealerHand);
    }

    gameOver = true;
    let result = "";

    if (dealerScore > 21 || playerScore > dealerScore) {
        balance += betAmount * 2; // doubles bet on win (will need to be changed based on wallet)
        result = " Player wins!";
    } else if (playerScore === dealerScore) {
        balance += betAmount; // return bet on tie
        result = " It's a tie!";
    } else {
        result = " Dealer wins!";
    }

    updateDisplay(result);
    endRound();
}

function endRound() {
    document.getElementById("gameButtons").style.display = "none";
    document.getElementById("newGameButton").style.display = "block";
    updateBalance();
}

function restartGame() {
    document.getElementById("betOptions").style.display = "block";
    document.getElementById("gameButtons").style.display = "none";
    document.getElementById("newGameButton").style.display = "none";
    updateDisplay(" Choose a bet to start a new round.");
}

// display functions
function updateDisplay(message = "") {
    let playerText = "Player Hand: (Score: 0)";
    let dealerText = "Dealer Hand: (Score: 0)";

    if (playerHand.length > 0) {
        playerText = `Player Hand: ${formatHand(playerHand)} (Score: ${calculateScore(playerHand)})`;
    }
    if (dealerHand.length > 0) {
        dealerText = `Dealer Hand: ${formatHand(dealerHand)} (Score: ${calculateScore(dealerHand)})`;
    }

    document.getElementById("gameResults").innerHTML = `
        <p>${playerText}</p>
        <p>${dealerText}</p>
        <h2>${message}</h2>
    `;
}


function updateBalance() {
    document.getElementById("balance").innerText = balance;
}

function formatHand(hand) {
    return hand.map(card => card.value + card.suit).join(" | ");
}
