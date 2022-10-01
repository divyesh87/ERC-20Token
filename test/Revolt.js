const Revolt = artifacts.require("RevoltToken")

contract("RevoltToken", accounts => {
    let contract;
    before(async () => {
        contract = await Revolt.deployed()
    })

    it("Initializes the state variables", async () => {
        assert(contract.address != "", "Contract failed to deploy")

        const value = await contract.totalSupply();
        assert(value.toString() == "1000000", "Total supply not set");

        const adminBalance = await contract.balanceOf(accounts[0]);
        assert(adminBalance.toString() == "1000000", "Not allocated to admin")

        const name = await contract.name();
        assert(name == "Revolt Token", "Name not initialized");

        const symbol = await contract.symbol();
        assert(symbol == "RVLT", "Incorrect Symbol");
    })

    it("Transfers tokens", async () => {
        const transferAmount = 2500;
        let tx;

        const senderBalBefore = (await contract.balanceOf(accounts[0])).toNumber();
        const receiverBalBefore = (await contract.balanceOf(accounts[1])).toNumber()

        try {
            tx = await contract.transfer(accounts[1], transferAmount);
        } catch (error) {
            assert(error.data.stack.includes("revert"), "Does not revert")
            assert.fail("Not enough bal")
        }

        const senderBalAfter = (await contract.balanceOf(accounts[0])).toNumber();
        const receiverBalAfter = (await contract.balanceOf(accounts[1])).toNumber()

        assert(senderBalBefore == senderBalAfter + transferAmount, "Sender not debited");

        assert(receiverBalAfter == receiverBalBefore + transferAmount, "Receiver Not credited")

        const txLog = tx.logs[0];


        assert(txLog.args._from == (accounts[0]).toString(), "Address of sender not emitted")
        assert(txLog.args._to == (accounts[1]).toString(), "Address of receiver not emitted")
        assert((txLog.args._value).toNumber() == transferAmount, "Amount Not emitted")

    })
    it("Allows setting allowance ", async () => {
        const tx = await contract.approve(accounts[1], 5000);
        const txLogs = tx.logs[0].args;

        assert(txLogs._from == accounts[0], "From is not correctly initialzed")

        assert(txLogs._spender == accounts[1], "Spender not initialed")

        assert(txLogs._value == 5000, "Incorrect value")
    })

    it("Allows to spend token on someone's behalf", async () => {
        await contract.approve(accounts[2], 2000);

        try {
            const tx = await contract.transferFrom(accounts[0], accounts[1], 200, { from: accounts[2] })

            const updatedAllowance = await contract.allowance(accounts[0], accounts[2])

            assert(updatedAllowance.toNumber() == 1800, "Allowance not updated")
        }
        catch (e) {
            console.log(e);
            assert.fail("You don't have permission or the spender doesn't have enough funds")
        }

    })

})