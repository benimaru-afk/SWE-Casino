// connect.js

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected account:', accounts[0]);
            // You could redirect them to the next page or show a success message here
        } catch (error) {
            console.error('User rejected the request:', error);
        }
    } else {
        alert('MetaMask is not installed. Please install it to use this site.');
    }
}

// Attach the function to the wallet connect button
document.getElementById('connectButton').addEventListener('click', connectWallet);

// Handle guest login
document.getElementById('guestButton').addEventListener('click', () => {
    // Optional: Set a guest flag if you need to check it later
    localStorage.setItem('guestUser', 'true');
    window.location.href = 'public/front/front.html';
});
