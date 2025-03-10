///let balance = 1000;  ///just for now
///these values can also be changed later
const spincost = 10;
const jackpot = 50;
const win = 15;

///i want to add a betting amount system and a pity system too over spring break

///fetching the current user's balance from localStorage (these two funcs should be integrated elsewhere)
function getUserBalance() {
	const user = getCurrentUser();
	return user ? user.bal : 0; // Default to 0 if no user is found
}

function updateUserBalance(newBalance) {
	///retrieve data from local storage
	let users = JSON.parse(localStorage.getItem("users")) || {};
	let user = getCurrentUser(); 

	if (!user) {
		console.log("No user is logged in!");
		return;
	}

	if (!users[user.username]) {
		console.log("User data not found in localStorage!");
        return;
	}

	users[user.username].bal = newBalance;

	localStorage.setItem("users", JSON.stringify(users));

	///update sessionStorage with the new balance
	sessionStorage.setItem("currentUser", JSON.stringify({ username: user.username, bal: newBalance }));

	updateUserInfo();
}


///spin function 
function spin() {
	let balance = getUserBalance();  
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
	
	///Save the updated balance back to storage
	updateUserBalance(balance);

	resultText += "<br>Current balance: " + balance + " coins";
	updateDisplay(resultText);
}

///display results
function updateDisplay(message) {
	const slotResults = document.getElementById("slotResults");
	slotResults.innerHTML = message;

	///Add a quick animation effect
	slotResults.style.transform = "scale(1.1)";
	setTimeout(() => {
		slotResults.style.transform = "scale(1)";
	}, 200);
}

///update user info on page load (also should be integrated elsewhere)
function updateUserInfo() {
	const user = getCurrentUser();
	if (user) {
		console.log("User:", user);
		console.log("User balance:", user.bal);	
	}
	document.getElementById("user-info").innerText = user 
		? `Logged in as ${user.username} (Balance: $${user.bal})`
		: "Not logged in";
}

///ensure user info updates after page load
document.addEventListener("DOMContentLoaded", updateUserInfo);
