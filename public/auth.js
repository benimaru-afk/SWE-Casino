///first draft user reg and login
function register(username, pass) {
	let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
        alert("Username already exists!");
        return;
    }
	/*
	if (localStorage.getItem(user)) {
		alert("User already exists!");
		return false;
	}
	*/
	
	users[username] = { pass: pass, bal: 1000 }; // Store user as an object
    localStorage.setItem("users", JSON.stringify(users)); // Save updated users
    
    alert("Registration successful!");
    
    // Ensure redirection happens properly
    setTimeout(() => {
        window.location.href = "login.html"; // Redirect to login page
    }, 100); 
}

function login(username, pass) {
	///const user = User.loadUser(username);
	let users = JSON.parse(localStorage.getItem("users")) || {}; // Get stored users
    
    if (users[username] && users[username].pass === pass) { // Check if user exists and password matches
        sessionStorage.setItem("currentUser", JSON.stringify({ username: username })); // Store only username
        alert("Login successful!");
        window.location.href = "front.html"; // Redirect after login
    } else {
        alert("Invalid username or password!");
    }
    /*if (user && user.verify(pass)) {
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        alert("Login successful!");
        return true;
    } else {
        alert("Invalid username or password!");
        return false;
    }
    */
}

function logout() {
	sessionStorage.removeItem("currentUser");
	alert("Logged out!");
}


function getCurrentUser() {
	const userData = sessionStorage.getItem("currentUser");
    return userData ? Object.assign(new User(), JSON.parse(userData)) : null;
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
