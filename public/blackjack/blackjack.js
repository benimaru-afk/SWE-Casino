let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;
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
    if (amount > Wallet.getBalance()) {
        updateDisplay(" Insufficient funds!");
        return;
    }

    betAmount = amount;
    Wallet.updateBalance(-betAmount);

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

    // Play the draw card sound
    const drawSound = document.getElementById("drawSound");
    drawSound.currentTime = 0; // rewind to start
    drawSound.play();

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
        Wallet.updateBalance(betAmount * 2); // doubles bet on win (will need to be changed based on wallet)
        result = " Player wins!";
    } else if (playerScore === dealerScore) {
        Wallet.updateBalance(betAmount); // return bet on tie
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
    const playerScore = calculateScore(playerHand);
    const dealerScore = "???";

    document.getElementById("playerScore").innerText = playerScore;
    document.getElementById("dealerScore").innerText = dealerScore;
    document.getElementById("gameMessage").innerText = message;

    renderHand("playerCards", playerHand);
    renderHand("dealerCards", dealerHand);
}

function renderHand(containerId, hand) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    hand.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");

        if (containerId === "dealerCards" && index === 0 && !gameOver) {
            // Hide the dealer's first card if game not over
            cardDiv.classList.add("back");
            container.appendChild(cardDiv);
        } else {
            const isRed = card.suit === "♡" || card.suit === "♢";
            cardDiv.classList.add(isRed ? "red" : "black");

            cardDiv.innerHTML = `
                <div class="top-left">${card.value}<br>${card.suit}</div>
                <div class="suit">${card.suit}</div>
                <div class="bottom-right">${card.value}<br>${card.suit}</div>
            `;
            container.appendChild(cardDiv);
        }
    });
}



function updateBalance() {
    document.getElementById("balance").innerText = Wallet.getBalance();
}

function formatHand(hand) {
    return hand.map(card => card.value + card.suit).join(" | ");
}
