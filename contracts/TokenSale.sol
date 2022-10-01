// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

interface TokenContract {
    function balanceOf(address) external view returns (uint256);

    function transfer(address, uint256) external returns (bool);
}

contract TokenSale {
    address admin;
    uint256 public tokenPrice;
    uint256 public tokenSold;
    address public tokenContractAddress;

    event Sell(address buyer, uint256 value);

    constructor(address _tokenContract) {
        admin = 0x2e1a3c300458a847928B5b58748FC442E5FA16DA;
        tokenContractAddress = _tokenContract;
        tokenPrice = 10000000000000000;
    }

    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _amount) public payable {
        require(
            TokenContract(tokenContractAddress).balanceOf(address(this)) >=
                _amount,
            "Contract out of tokens"
        );
        require(
            msg.value == multiply(tokenPrice, _amount),
            "Please send enough ethereum"
        );

        tokenSold += _amount;
        TokenContract(tokenContractAddress).transfer(msg.sender, _amount);
        emit Sell(msg.sender, _amount);
    }

    function endSale() public {
        require(msg.sender == admin, "Only allowed by admin");

        TokenContract(tokenContractAddress).transfer(admin, 750000 - tokenSold);
        selfdestruct(payable(admin));
    }
}
