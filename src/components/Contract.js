import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TokenBuildInfo from "../contracts/RevoltToken.json";

function Contract() {

    const [blocknum, setblocknum] = useState()

    useEffect(() => {
        async function main() {

            const provider = new ethers.providers.AlchemyProvider("goerli", "kDLMYqyIdr1tmp3HrjnN81iXsDnyQRAO")
            const wallet = new ethers.Wallet("4cea9033a4bdcf8ef4983b415dedcacb32ac34e7296641affa02bf5761ecf940", provider)

            const contractFactory = new ethers.ContractFactory(TokenBuildInfo.abi, TokenBuildInfo.bytecode, wallet)


            const contracts = await contractFactory.deploy(10000);

            const name = await contracts.name()

            console.log(name);


        }
        main()
    }, [])

    return (
        <div>{blocknum}</div>
    )
}

export default Contract