function register(username, pass) {
	let users = JSON.parse(localStorage.getItem("users")) || {};
	if (users[username]) {
		alert("Username already exists!");
		return;
	}
    
	users[username] = { pass: pass, bal: 1000 }; ///initial bal of 1000
	localStorage.setItem("users", JSON.stringify(users)); 
    
    alert("Registration successful!");

	///login redirect
	window.location.href = "login.html";
}

function login(username, pass) {
	let users = JSON.parse(localStorage.getItem("users")) || {}; 
    
	if (users[username] && users[username].pass === pass) { 
		sessionStorage.setItem("currentUser", JSON.stringify({ username: username }));
        ///after login show bal
		const balance = users[username].bal;
		alert(`Login successful! Your balance is: $${balance}`);
        
        window.location.href = "front.html";
	} else {
		alert("Invalid username or password!");
	}

}

function logout() {
	sessionStorage.removeItem("currentUser");
	alert("Logged out!");
	window.location.href = "login.html"; 
}


function getCurrentUser() {
	const userData = sessionStorage.getItem("currentUser");
	if (userData) {
		const { username } = JSON.parse(userData);
		const users = JSON.parse(localStorage.getItem("users"));
		const user = users[username];
		return { username: username, bal: user ? user.bal : 1000 }; ///if user exists return bal
	}
	return null; ///no user in session
}

document.addEventListener("DOMContentLoaded", function() {
	const loginForm = document.getElementById("login-form");
	if (loginForm) {
		loginForm.addEventListener("submit", function(event) {
			event.preventDefault();
			const username = document.getElementById("login-username").value;
			const password = document.getElementById("login-password").value;
			login(username, password);
		});
	}

	const registerForm = document.getElementById("register-form");
	if (registerForm) {
		registerForm.addEventListener("submit", function(event) {
			event.preventDefault();
			const username = document.getElementById("reg-username").value;
			const password = document.getElementById("reg-password").value;
			register(username, password);
		});
	}
});
