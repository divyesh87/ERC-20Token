// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

contract RevoltToken {
    uint256 public totalSupply;
    string public name = "Revolt Token";
    string public symbol = "RVLT";
    uint256 public decimals;

    address public admin;
    address public tokenSale;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _from,
        address indexed _spender,
        uint256 _value
    );

    constructor(uint256 _totalSupply, address _admin) {
        admin = _admin;
        totalSupply = _totalSupply;
        decimals = 0;
        balanceOf[admin] = 250000;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value, "Not enough balance");
        balanceOf[_to] += _value;
        balanceOf[msg.sender] -= _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(
            _value <= balanceOf[_from],
            "Spender account doesn't have enough balance"
        );
        require(
            _value <= allowance[_from][msg.sender],
            "You don't have permission to spend this amount of token"
        );

        balanceOf[_to] += _value;
        balanceOf[_from] -= _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }

    function transferToTokenSale(address _tokenSale) external returns (bool) {
        require(msg.sender == admin, "Only admin allowed");
        balanceOf[_tokenSale] = 750000;
        return true;
    }
}
