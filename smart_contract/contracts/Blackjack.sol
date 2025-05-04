// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Blackjack {
    struct Game {
        uint256 bet;
        uint8[] playerCards;
        uint8[] dealerCards;
        bool active;
    }

    mapping(address => Game) public games;

    function startGame() external payable {
        require(msg.value > 0, "Bet must be > 0");
        Game storage game = games[msg.sender];
        require(!game.active, "Finish previous game first");
        game.bet = msg.value;
        game.playerCards = [randomCard(), randomCard()];
        game.dealerCards = [randomCard()];
        game.active = true;
    }

    function hit() external {
        Game storage game = games[msg.sender];
        require(game.active, "No game in progress");
        game.playerCards.push(randomCard());

        if (handValue(game.playerCards) > 21) {
            game.active = false;
        }
    }

    function stand() external {
        Game storage game = games[msg.sender];
        require(game.active, "No game in progress");

        // Dealer draws cards
        while (handValue(game.dealerCards) < 17) {
            game.dealerCards.push(randomCard());
        }

        uint playerScore = handValue(game.playerCards);
        uint dealerScore = handValue(game.dealerCards);

        game.active = false;
        if (playerScore > 21 || (dealerScore <= 21 && dealerScore > playerScore)) {
		// player loses, contract keeps bet
        } else if (playerScore == dealerScore) {
            payable(msg.sender).transfer(game.bet); // draw
        } else {
            payable(msg.sender).transfer(game.bet * 2); // win
        }
    }

    function randomCard() internal view returns (uint8) {
        return uint8(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 13 + 1);
    }

    function handValue(uint8[] memory cards) internal pure returns (uint) {
        uint total = 0;
        for (uint i = 0; i < cards.length; i++) {
            uint val = cards[i];
            total += val > 10 ? 10 : val;
        }
        return total;
    }
    function getFullGame(address player) external view returns (
    uint256 bet,
    uint8[] memory playerCards,
    uint8[] memory dealerCards,
    bool active
) {
    Game storage g = games[player];
    return (g.bet, g.playerCards, g.dealerCards, g.active);
}
receive() external payable {}

}

