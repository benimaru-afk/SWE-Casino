let balance = 1000;  ///just for now
///these values can also be changed later
const spincost = 10;
const jackpot = 50;
const win = 15;

///i want to add a betting amount system on the weekend and a pity system too


///spin function 
function spin() {
    const audio = document.getElementById("spinSound");

    // Play the audio immediately
    audio.currentTime = 0; // Rewind to start if it’s still playing
    audio.play();

    if (balance < spincost) {
        updateDisplay("❌ Not enough coins to spin!");
        return;
    }

    balance -= spincost;

    const symbols = ["🍒", "🍋", "🔔", "⭐", "💎"];
    let result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    /// NEW: Handle slot animation with a 0.75-second delay
    const slotElems = [
        document.getElementById("slot1"),
        document.getElementById("slot2"),
        document.getElementById("slot3")
    ];

    setTimeout(() => {
        let animation = setInterval(() => {
            for (let i = 0; i < 3; i++) {
                slotElems[i].textContent = symbols[Math.floor(Math.random() * symbols.length)];
            }
        }, 80); // fast shuffle

        setTimeout(() => {
            clearInterval(animation);
        }, 3000); // stop shuffle at 3s

        setTimeout(() => {
            slotElems[0].textContent = result[0];
        }, 3240);

        setTimeout(() => {
            slotElems[1].textContent = result[1];
        }, 3480);

        setTimeout(() => {
            slotElems[2].textContent = result[2];

            /// Once all revealed, calculate the outcome and display message
            let resultText = "Spun: " + result.join(" | ");

            if (result[0] === result[1] && result[1] === result[2]) {
                resultText += "<br>🎉 JACKPOT! You won " + jackpot + " coins! 🎉";
                balance += jackpot;
            } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
                resultText += "<br>😊 Small win! You won " + win + " coins! 🎉";
                balance += win;
            } else {
                resultText += "<br>😞 Try again!";
            }

            resultText += "<br>Current balance: " + balance + " coins";
            updateDisplay(resultText);
        }, 3720); // final reveal + result message
    }, 250); // Delay animation by 0.25 seconds
}


///display results
function updateDisplay(message) {
    const slotResults = document.getElementById("slotResults");
    slotResults.innerHTML = message;

    // Add a quick animation effect
    slotResults.style.transform = "scale(1.1)";
    setTimeout(() => {
        slotResults.style.transform = "scale(1)";
    }, 200);
}
