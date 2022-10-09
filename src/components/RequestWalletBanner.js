import React from 'react'
import styles from "../styles/wrapper.module.css"

function RequestWalletBanner() {
    return (
        <div className={styles.wrapper}>

            <h1>Uh oh...</h1>
            <div className={styles.errorInfo}>Looks like you don't have a wallet !</div>
            <br />
            <div className={styles.errorInfo}>Please install MetaMask or a similar ETH wallet in your browser ! </div>
        </div>
    )
}

export default RequestWalletBanner;