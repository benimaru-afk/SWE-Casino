// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Slots {
    address public owner;

    event GameResult(address indexed player, uint8[3] reels, uint payout);

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    function play() external payable {
        require(msg.value > 0, "Bet must be > 0");

        uint8[3] memory reels;
        for (uint8 i = 0; i < 3; i++) {
            reels[i] = randomSymbol(i);
        }

        uint payout = calculatePayout(reels, msg.value);
        if (payout > 0) {
            require(address(this).balance >= payout, "Casino can't pay out");
            payable(msg.sender).transfer(payout);
        }

        emit GameResult(msg.sender, reels, payout);
    }

    function calculatePayout(uint8[3] memory reels, uint bet) internal pure returns (uint) {
        if (reels[0] == reels[1] && reels[1] == reels[2]) {
            if (reels[0] == 7) return bet * 10; // Jackpot
            return bet * 5; // Regular triple match
        }
        if (reels[0] == reels[1] || reels[1] == reels[2] || reels[0] == reels[2]) {
            return bet * 2; // Any double match
        }
        return 0;
    }

    function randomSymbol(uint nonce) internal view returns (uint8) {
        return uint8(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % 8); // 0-7 symbols
    }
}

