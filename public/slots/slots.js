///let balance = 1000;  ///just for now
///these values can also be changed later
const spincost = 10;
const jackpot = 50;
const win = 15;

///i want to add a betting amount system on the weekend and a pity system too

///fetching the current user's balance from localStorage
function getUserBalance() {
    const user = getCurrentUser();
    return user ? user.bal : 0; // Default to 0 if no user is found
}

function updateUserBalance(newBalance) {
    // Get full user data from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || {};
    let user = getCurrentUser();  // Get the currently logged-in user by username from sessionStorage
    
    if (!user || !users[user.username]) return;  // Ensure user exists
    
    // Update balance in the users object
    users[user.username].bal = newBalance;  // Update balance
    
    // Save the updated users object back to localStorage
    localStorage.setItem("users", JSON.stringify(users)); 
    
    // Update user info on the page immediately after updating the balance
    updateUserInfo();
}


///save the updated balance back to localStorage
/*
function updateUserBalance(newBalance) {
    let user = getCurrentUser();
    if (!user) return;

    user.bal = newBalance;  // Update balance
    localStorage.setItem("currentUser", JSON.stringify(user)); // Save back to storage
    updateUserInfo(); // Refresh display!
    /*
    if (user) {
        user.bal = newBalance;
        let users = JSON.parse(localStorage.getItem("users"));
        users[user.username].bal = newBalance;
        localStorage.setItem("users", JSON.stringify(users));

        // Also update the display to show new balance
        updateUserInfo();
    }
    */
///}


///spin function 
function spin() {
	let balance = getUserBalance();  // Fetch balance dynamically
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
	
	// Save the updated balance back to storage
    updateUserBalance(balance);

	resultText += "<br>Current balance: " + balance + " coins";
	updateDisplay(resultText);
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

/// Update user info on page load
function updateUserInfo() {
    const user = getCurrentUser();
    document.getElementById("user-info").innerText = user 
        ? `Logged in as ${user.username} (Balance: $${user.bal})`
        : "Not logged in";
}

/// Ensure user info updates after page load
document.addEventListener("DOMContentLoaded", updateUserInfo);
