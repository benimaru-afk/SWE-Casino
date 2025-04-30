// wallet.js

const Wallet = (function () {
  let balance = 1000; // Default guest balance
  let isGuest = true;
  let account = null;

  function init() {
      if (localStorage.getItem('guestUser') === 'true') {
          isGuest = true;
          balance = parseInt(localStorage.getItem('guestBalance') || '1000', 10);
      } else {
          isGuest = false;
          // Simulated real wallet handling
          account = "0x1234...abcd";
          balance = 1000; // Simulated balance
      }
  }

  function getBalance() {
      // Always reflect the latest from localStorage if guest
      if (isGuest) {
          const stored = localStorage.getItem('guestBalance');
          return stored ? parseInt(stored, 10) : balance;
      }
      return balance;
  }

  function updateBalance(amount) {
      balance = getBalance() + amount; // getBalance pulls latest
      if (isGuest) {
          localStorage.setItem('guestBalance', balance);
      }
      // else update real wallet if not a guest
  }

  function isGuestUser() {
      return isGuest;
  }

  function getAccount() {
      return account;
  }

  function setBalance(value) {
      balance = value;
      if (isGuest) {
          localStorage.setItem('guestBalance', balance);
      }
  }

  return {
      init,
      getBalance,
      updateBalance,
      isGuestUser,
      getAccount,
      setBalance
  };
})();
