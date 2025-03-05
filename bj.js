const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public')); 

let gameState = {};

// new game
app.post('/start', (req, res) => {
    gameState = {
        deck: shuffleDeck(createDeck()),
        playerHand: [],
        dealerHand: [],
        gameOver: false,
        message: ''
    };
    
    // deal cards
    gameState.playerHand.push(drawCard(), drawCard());
    gameState.dealerHand.push(drawCard(), drawCard());
    
    res.json(gameState);
});

// player hit
app.post('/hit', (req, res) => {
    if (gameState.gameOver) return res.json({ message: "Game is over!" });
    
    gameState.playerHand.push(drawCard());
    
    if (calculateScore(gameState.playerHand) > 21) {
        gameState.gameOver = true;
        gameState.message = "Player busts! Dealer wins.";
    }
    
    res.json(gameState);
});

// player stand
app.post('/stand', (req, res) => {
    if (gameState.gameOver) return res.json({ message: "Game is over!" });

    const playerScore = calculateScore(gameState.playerHand);
    let dealerScore = calculateScore(gameState.dealerHand);

    // 17 rule or dealer score is below the player's score
    while (dealerScore < 17 || dealerScore < playerScore) {
        gameState.dealerHand.push(drawCard());
        dealerScore = calculateScore(gameState.dealerHand);
    }

    // winner
    if (dealerScore > 21 || playerScore > dealerScore) {
        gameState.message = "Player wins!";
    } else if (playerScore === dealerScore) {
        gameState.message = "It's a tie!";
    } else {
        gameState.message = "Dealer wins!";
    }

    gameState.gameOver = true;
    res.json(gameState);
});



// deck 
function createDeck() {
    const suits = ['♤', '♡', '♢', '♧'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    return deck.sort(() => Math.random() - 0.5);
}

function drawCard() {
    return gameState.deck.pop();
}

// score
function calculateScore(hand) {
    let score = 0;
    let aces = 0;
    
    for (let card of hand) {
        if (['J', 'Q', 'K'].includes(card.value)) {
            score += 10;
        } else if (card.value === 'A') {
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

// test
const PORT = 3000;
app.listen(PORT, () => console.log(`${PORT}`));
