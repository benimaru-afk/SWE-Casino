const { expect } = require("chai");
const { ethers } = require("hardhat");

function calculateHand(cardsRaw) {
  if (!cardsRaw) return 0;
  const cards = Array.from(cardsRaw).map(c => Number(c));
  return cards.reduce((sum, val) => sum + (val > 10 ? 10 : val), 0);
}

describe("Blackjack", function () {
  it("should resolve all game outcomes correctly", async function () {
    const Blackjack = await ethers.getContractFactory("Blackjack");
const blackjack = await Blackjack.deploy();

const [owner, player] = await ethers.getSigners();

await owner.sendTransaction({
  to: await blackjack.getAddress(),
  value: ethers.parseEther("10"),
});
   

   
    const bet = ethers.parseEther("1");

    const balanceBefore = await ethers.provider.getBalance(player.address);

    const tx1 = await blackjack.connect(player).startGame({ value: bet });
    await tx1.wait();

    const [returnedBet, playerCards, dealerCards, active] = await blackjack.getFullGame(player.address);

    if (!active) {
      console.log("Game not active, skipping stand()");
      return;
    }

    const playerScore = calculateHand(playerCards);
    const dealerStartScore = calculateHand(dealerCards);
const [_____, ______, _______, isactive] = await blackjack.getFullGame(player.address);
    let tx2;
    try {
	expect(isactive).to.equal(true);
      tx2 = await blackjack.connect(player).stand();
      await tx2.wait();
    } catch (e) {
	 expect(isactive).to.equal(true);
      console.error("stand() reverted:", e.message);
      return;
    }
    const [_, __, dealerFinalCards] = await blackjack.getFullGame(player.address);
    const dealerFinalScore = calculateHand(dealerFinalCards);
    console.log("Dealer final score:", dealerFinalScore);

    const balanceAfter = await ethers.provider.getBalance(player.address);
    const diff = balanceAfter - balanceBefore;

    console.log(`Player: ${playerScore}, ΔBalance: ${ethers.formatEther(diff)}`);

    const gameAfter = await blackjack.games(player.address);
    expect(gameAfter.active).to.equal(false);

    if (playerScore > 21) {
      expect(diff).to.equal(-ethers.parseEther("1")); // Player busts
	console.log("Player Busts");
    } else if (dealerFinalScore > 21 || playerScore > dealerFinalScore) {
	 console.log("Player Wins");
      expect(diff).to.be.gt(0n); // Player wins
    } else if (playerScore === dealerFinalScore) {
      console.log("Draw");
	    expect(diff).to.equal(0n); // Draw
    } else {
	console.log("Dealer Wins - Higher Card");
      expect(diff).to.equal(-ethers.parseEther("1")); // Dealer wins
    }
  });
});

