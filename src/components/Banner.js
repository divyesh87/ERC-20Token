// Token Contract : 0xF261A4daA2F280CFf2dAEE0bDdE764D9bC021A42
// Token Sale contract : 0x10e123B457e9B4a4ca7A5be443E180DF4fd30B78
import React, { useState, useEffect, useRef } from 'react'
import styles from "../styles/RequestWallet.module.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Modal } from 'react-bootstrap'
import TokenSaleBuild from "../contracts/TokenSale.json";
import Web3 from 'web3';

function Banner() {

    const [selectedAccount, setselectedAccount] = useState()
    const [input, setInput] = useState("")
    const [inputDisabled, setinputDisabled] = useState(true)
    const [showErrorModal, setshowErrorModal] = useState(false)
    const [TxSuccess, setTxSuccess] = useState(false)
    const tokenSaleContract = useRef()
    const tokenPrice = "10000000000000000";

    useEffect(() => {

        const provider = window.ethereum
        const web3 = new Web3(provider)

        tokenSaleContract.current = new web3.eth.Contract(TokenSaleBuild.abi, "0x10e123B457e9B4a4ca7A5be443E180DF4fd30B78")
    }, [])


    async function connectMetaMask() {
        const selectedAccount = await window.ethereum.request({ method: "eth_requestAccounts" })
        setselectedAccount(selectedAccount[0])
        setinputDisabled(false)
    }

    function handleChange(e) {
        setInput(e.target.value)
    }

    window.ethereum.on("accountsChanged", (accounts) => {
        setselectedAccount(accounts[0])
    })


    async function buyToken() {

        try {
            const tx = await tokenSaleContract.current.methods.buyTokens(input).send({
                from: selectedAccount,
                value: (parseInt(tokenPrice) * input).toString()
            })
            if (tx.blockHash != null) {
                setTxSuccess(true)
                setInput("")
            } else {
                throw new Error("Transaction failed");
            }
        } catch (e) {
            console.log(e);
            setshowErrorModal(true)
        }
    }

    function handleBuy(e) {
        e.preventDefault();
        input > 0 ? buyToken() : alert("Please enter a valid input")
    }

    function handleModalClose() {
        setshowErrorModal(false)
    }
    function handleTxSuccessClose() {
        setTxSuccess(false)
    }

    return (
        <>
            <h1 style={{ fontFamily: "sans-serif", fontSize: "35px", }}>Revolt Token ICO</h1>

            <div className={styles.wrapper}>

                <h5>Buy the Revolt Token , an ERC-20 Token</h5>
                <h6>The ICO price of the token is 0.01 ETH</h6>


                <Modal show={showErrorModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Something went wrong
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Looks like the transaction has failed , Please try again.
                        <br />
                        Possible Reasons:
                        <br />
                        <br />
                        1 : Please check if you have sufficient funds in your wallet.
                        <br />
                        2 : You Rejected the Transaction from your wallet
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='primary' onClick={handleModalClose}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={TxSuccess} onHide={handleTxSuccessClose}>
                    <Modal.Header closeButton>
                        <Modal.Title className='text-success'>
                            Congrats ! Successfully bought the tokens
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        You are now a HODLER !
                        <br />
                        Tokens have been deposited in your wallet. Don't see your tokens? Try below steps :
                        <br />
                        <br />
                        Step 1 : Open MetaMask wallet , Go to assets
                        <br />
                        Step 2 : Click Import tokens 
                        <br />
                        Step 3 : Enter the Contract address below and you will see $RVLT tokens in your account 
                        <br />
                        <br />

                        <span>Contract Adress : 0xF261A4daA2F280CFf2dAEE0bDdE764D9bC021A42</span>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='primary' onClick={handleTxSuccessClose}>Buy again</Button>
                    </Modal.Footer>

                </Modal>

                <Form style={{ minWidth: "100%" }}>
                    <Form.Group>
                        <Form.Label>Buy Now!</Form.Label>
                        <Form.Control
                            disabled={inputDisabled} input={input} onChange={(e) => handleChange(e)}
                            placeholder='$RVLT Tokens to buy...' className='mt-3'>
                        </Form.Control>
                        <br />
                        <h6>Approximate Cost : {input > 0
                            ? <span className='text-muted'>{0.01 * input} ETH</span>
                            : <span className='text-muted'> --</span>}</h6>
                        <Button
                            onClick={e => handleBuy(e)} className='mt-3' type='submit'>
                            Buy
                        </Button>
                    </Form.Group>
                </Form>
                <br />
                {selectedAccount ?
                    <h5 >Your account is : {<span style={{ color: "grey" }}>{selectedAccount}</span>}</h5>
                    : <Button onClick={connectMetaMask}>Connect MetaMask</Button>}
            </div>
        </>
    )
}

export default Banner;