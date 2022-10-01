import Banner from "./components/Banner"
// import { useState } from "react"
import RequestWalletBanner from "./components/RequestWalletBanner";

function App() {

  const walletConnected = window.ethereum;

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(to right, #8360c3, #2ebf91)" }} className="App">
      {walletConnected ? <Banner /> : <RequestWalletBanner />}
    </div>
  );
}

export default App;
