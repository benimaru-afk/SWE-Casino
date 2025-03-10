///first draft for future user data mgmt
///currently not being used rn except for user constructor
class User {
	constructor(username, pass, bal = 1000) {
		this.username = username;
		///this.protectedPass = this.hashPass(pass); 
		this.pass = pass;
		this.bal = bal;
	}
	
	
	///simple hashing for Base64 (only for demo purposes rn)
	hashPass(pass) {
		return btoa(pass);
	}
	
	///login validation
	verify(pass) {
		///return this.protectedPass === btoa(pass);
		return this.pass === pass;
	}
	
	///save user data to local storage
	save() {
		let users = JSON.parse(localStorage.getItem("users")) || {};
        users[this.username] = { pass: this.pass, bal: this.bal };
        localStorage.setItem("users", JSON.stringify(users));
		///localStorage.setItem(this.username, JSON.stringify(this));
	}
	
	///static method for loading user from storage
	static loadUser(username) {
        let users = JSON.parse(localStorage.getItem("users")) || {};
        if (!users[username]) return null;
        return new User(username, users[username].pass, users[username].bal);
    	}
		/*
		const userData = localStorage.getItem(username);
	    if (!userData) return null;
	    const parsedData = JSON.parse(userData);
	    ///return new User(parsedData.username, parsedData.protectedPass, parsedData.bal); 
	    return new User(parsedData.username, parsedData.pass, parsedData.bal); 
	    }
	    */
	   
}