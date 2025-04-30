const canvas = document.getElementById('plinkoCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;

const gravity = 0.15;
const damping = 0.75;
const pegRadius = 5;
const discRadius = 10;
const pegs = [];
const discs = [];
const slots = [];

// Remove the cash-out button from the UI
document.getElementById('cashOutButton').style.display = 'none';

function updateBalance() {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.innerText = `${Wallet.getBalance()}`;
    }
}

function createPegGrid() {
    const rows = 10;
    const startX = canvas.width / 2;
    const startY = 50;
    const spacing = 50;

    for (let row = 1; row < rows; row++) { // Start from row 1 to skip the top peg
        for (let col = 0; col <= row; col++) {
            let x = startX - (row * spacing / 2) + (col * spacing);
            let y = startY + (row * spacing);
            pegs.push({ x, y });
        }
    }
}


function createPointSlots() {
    const slotWidth = canvas.width / 14;
    const multipliers = [0, 0, 0, 0.25, 2, 1, 0.5, 0.5, 1, 2, 0.25, 0, 0, 0, 0];

    for (let i = 0; i < 14; i++) {
        slots.push({ 
            x: i * slotWidth, 
            width: slotWidth, 
            points: multipliers[i] * 50, // Directly apply the multiplier
            animationProgress: 0
        });
    }
}

function dropDisc(x) {
    if (Wallet.getBalance() < 50) {
        alert("Insufficient balance to play.");
        return;
    }
    
    Wallet.updateBalance(-50); // Deduct cost using wallet's updateBalance method
    updateBalance();
    
    discs.push({ x, y: 0, vx: 0, vy: 0 });
}

function resolveCollision(disc, peg) {
    let dx = disc.x - peg.x;
    let dy = disc.y - peg.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < pegRadius + discRadius) {
        // Play the bounce sound
        const bounceSound = new Audio('bounce.mp3');
        bounceSound.play();

        let angle = Math.atan2(dy, dx);
        let overlap = pegRadius + discRadius - distance;

        disc.x += Math.cos(angle) * overlap;
        disc.y += Math.sin(angle) * overlap;

        let normalX = Math.cos(angle);
        let normalY = Math.sin(angle);
        let dotProduct = disc.vx * normalX + disc.vy * normalY;

        disc.vx -= (1 + damping) * dotProduct * normalX;
        disc.vy -= (1 + damping) * dotProduct * normalY;

        disc.vx += (Math.random() - 0.5) * 0.5;
    }
}

function update() {
    discs.forEach(disc => {
        disc.vy += gravity;
        disc.y += disc.vy;
        disc.x += disc.vx;

        pegs.forEach(peg => {
            resolveCollision(disc, peg);
        });

        disc.vx *= 0.98;
        disc.vy *= 0.98;

        if (disc.x - discRadius < 0 || disc.x + discRadius > canvas.width) {
            disc.vx *= -0.5;
            disc.x = Math.max(discRadius, Math.min(canvas.width - discRadius, disc.x));
        }

        if (disc.y + discRadius >= canvas.height - 50) {
            let landedSlot = slots.find(slot => disc.x > slot.x && disc.x < slot.x + slot.width);
            if (landedSlot) {
                balance += landedSlot.points; // Add winnings immediately
                Wallet.updateBalance(landedSlot.points);
                updateBalance();

                landedSlot.animationProgress = 1.0; // Start bounce animation
            }
            discs.splice(discs.indexOf(disc), 1);
        }
    });

    slots.forEach(slot => {
        if (slot.animationProgress > 0) {
            slot.animationProgress -= 0.05;
        }
    });
}

function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pegs.forEach(peg => {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#F8F8FF';
        ctx.fill();
    });

    discs.forEach(disc => {
        ctx.beginPath();
        ctx.arc(disc.x, disc.y, discRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
    });

    slots.forEach(slot => {
        let bounceHeight = slot.animationProgress * 10;

        ctx.fillStyle = '#A372D1';
        drawRoundedRect(slot.x, canvas.height - 50 - bounceHeight, slot.width, 50 + bounceHeight, 10);

        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(slot.points, slot.x + slot.width / 3, canvas.height - 20 - bounceHeight);
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update event listener: Ball drops from the center of the screen now
canvas.addEventListener('click', () => {
    dropDisc(canvas.width / 2); // Drop the disc from the center of the canvas
});

createPegGrid();
createPointSlots();
updateBalance();
gameLoop();
