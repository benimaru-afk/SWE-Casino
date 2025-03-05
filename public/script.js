async function startGame() {
    const response = await fetch('/start', { method: 'POST' });
    const data = await response.json();
    updateUI(data);
    
    document.querySelector("button[onclick='hit()']").disabled = false;
    document.querySelector("button[onclick='stand()']").disabled = false;
}

async function hit() {
    const response = await fetch('/hit', { method: 'POST' });
    const data = await response.json();
    updateUI(data);
}

async function stand() {
    const response = await fetch('/stand', { method: 'POST' });
    const data = await response.json();
    updateUI(data);
    
    document.querySelector("button[onclick='hit()']").disabled = true;
    document.querySelector("button[onclick='stand()']").disabled = true;
}

function updateUI(gameState) {
    document.getElementById('player-hand').innerHTML = `Cards: ${formatHand(gameState.playerHand)}`;
    document.getElementById('dealer-hand').innerHTML = `Cards: ${formatHand(gameState.dealerHand)}`;
    document.getElementById('message').innerText = gameState.message;
}

function formatHand(hand) {
    return hand.map(card => `${card.value}${card.suit}`).join(', ');
}
