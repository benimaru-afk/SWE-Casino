// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Plinko {
    address public owner;

    event PlinkoResult(address indexed player, uint8 slot, uint payout);

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    function play() external payable {
        require(msg.value > 0, "Bet required");

        uint8 slot = randomSlot();
        uint payout = calculatePayout(slot, msg.value);

        if (payout > 0) {
            require(address(this).balance >= payout, "Casino can't pay out");
            payable(msg.sender).transfer(payout);
        }

        emit PlinkoResult(msg.sender, slot, payout);
    }

    function calculatePayout(uint8 slot, uint bet) internal pure returns (uint) {
        if (slot == 0 || slot == 7) return bet * 10; // jackpot sides
        if (slot == 3 || slot == 4) return bet * 2; // center hits
        return 0;
    }

    function randomSlot() internal view returns (uint8) {
        return uint8(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 8);
    }
}

