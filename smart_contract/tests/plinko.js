const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Plinko", function () {
  it("should play a game and resolve payouts correctly", async function () {
    const Plinko = await ethers.getContractFactory("Plinko");
    const plinko = await Plinko.deploy();

    const [owner, player] = await ethers.getSigners();

    await owner.sendTransaction({
      to: await plinko.getAddress(),
      value: ethers.parseEther("10"),
    });

    const bet = ethers.parseEther("1");
    const balanceBefore = await ethers.provider.getBalance(player.address);

    const tx = await plinko.connect(player).play({ value: bet });
    const receipt = await tx.wait();

    const result = receipt.logs
      .map((log) => {
        try {
          return plinko.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((log) => log && log.name === "PlinkoResult");

    expect(result).to.not.be.undefined;
    const { slot, payout } = result.args;

    console.log("Plinko Slot:", Number(slot));
    console.log("Payout:", ethers.formatEther(payout));

    const balanceAfter = await ethers.provider.getBalance(player.address);
    const diff = balanceAfter - balanceBefore;

    if (payout > 0n) {
      expect(diff).to.be.gte(0n); // won 
    } else {
      expect(diff).to.be.lt(0n); // lost
    }
  });
});

