const TokenSale = artifacts.require("TokenSale.sol")
const TokenContract = artifacts.require("RevoltToken.sol")

contract("TokenSale", (accounts) => {

    it("Deploys the contract", async () => {
        const contract = await TokenSale.deployed();
        assert(contract.address != "", "Contract not deployed")
    })

    it("Assigns the price of token", async () => {
        const contract = await TokenSale.deployed();
        const price = await contract.tokenPrice();
        const expectedPrice = 1000000000000000;
        assert(expectedPrice == price.toNumber(), "Price not set")
    })

    it("Facilitates Token buying", async () => {
        const contract = await TokenSale.deployed();
        const tokenContract = await TokenContract.deployed();

        await tokenContract.transfer(contract.address, 750000)

        const balance = await tokenContract.balanceOf(contract.address);

        assert(balance.toNumber() == 750000, "Tokens not transferrred to contract")

        try {
            const tx = await contract.buyTokens(500, { from: accounts[1], value: 500000000000000000 });
            const acBalance = await tokenContract.balanceOf(accounts[1])
            assert(acBalance.toNumber() == 500, "Tokens not deposited in buyers's account")
            const txLogs = tx.logs[0].args;

            assert(txLogs.buyer == accounts[1], "Buyer event not emitted")
            assert(txLogs.value == 500, "Amount not emitted")

        } catch (e) {
            assert.fail("Error occured in token transfer")
        }
    })

    it("Ends the token sale and transfers the remaining tokens to admin", async () => {
        const contract = await TokenSale.deployed();
        const tokenContract = await TokenContract.deployed();

        await contract.buyTokens(10000, { from: accounts[1], value: 10000000000000000000 })

        const adminBalanceBefore = (await tokenContract.balanceOf(accounts[0])).toNumber()


        await contract.endSale()
        const adminBalanceAfter = (await tokenContract.balanceOf(accounts[0])).toNumber()


        assert(adminBalanceAfter == adminBalanceBefore + 739500, "Tokens not sent to admin")

    })

})