let balance = 1000;  ///just for now
///these values can also be changed later
const spincost = 10;
const jackpot = 50;
const win = 15;

///i want to add a betting amount system on the weekend and a pity system too


///spin function 
function spin() {
	if (balance < spincost) {
	        updateDisplay("❌ Not enough coins to spin!");
	        return;
	}

	///updating after spin
	balance -= spincost; 

///the second icon here is a lemon just ignore the fact that it doesn't show up within the file depending on font (it's there)
	const symbols = ["🍒", "🍋", "🔔", "⭐", "💎"];
	let result = [
		symbols[Math.floor(Math.random() * symbols.length)],
		symbols[Math.floor(Math.random() * symbols.length)],
		symbols[Math.floor(Math.random() * symbols.length)]
	];

	let resultText = "Spun: " + result.join(" | ");

	if (result[0] === result[1] && result[1] === result[2]) {
		///4% chance
		resultText += "<br>🎉 JACKPOT! You won " + jackpot + " coins! 🎉";
		balance += jackpot; // Add winnings
	} else if (result[0] === result[1] || result[1] === result [2] || result[0] === result[2]) {
		resultText += "<br>😊 Small win! You won " + win + " coins! 🎉";
		balance += win; // Add winnings
	} else {
		resultText += "<br>😞 Try again!";
	}

	resultText += "<br>Current balance: " + balance + " coins";
	updateDisplay(resultText);
}

///display results
function updateDisplay(message) {
	document.getElementById("slotResults").innerHTML = message;
}
