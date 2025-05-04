const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Slots", function () {
  it("should play a game and handle payouts correctly", async function () {
    const Slots = await ethers.getContractFactory("Slots");
    const slots = await Slots.deploy();
    const [owner, player] = await ethers.getSigners();


    await owner.sendTransaction({
      to: await slots.getAddress(),
      value: ethers.parseEther("10"),
    });

    const bet = ethers.parseEther("1");
    const balanceBefore = await ethers.provider.getBalance(player.address);

    const tx = await slots.connect(player).play({ value: bet });
    const receipt = await tx.wait();

    const result = receipt.logs
      .map((log) => {
        try {
          return slots.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((log) => log && log.name === "GameResult");

    expect(result).to.not.be.undefined;
    const { reels, payout } = result.args;

    console.log("Reels:", reels.map(n => Number(n)));
    console.log("Payout:", ethers.formatEther(payout));

    const balanceAfter = await ethers.provider.getBalance(player.address);
    const netGain = balanceAfter - balanceBefore;

    if (payout > 0n) {
      expect(netGain).to.be.gte(0n); 
    } else {
      expect(netGain).to.be.lt(0n); // Paid gas, got nothing back
    }
  });
});

