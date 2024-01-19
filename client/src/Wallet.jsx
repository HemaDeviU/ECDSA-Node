import server from "./server";
import { useState } from "react";

function Wallet({ address, setAddress, balance, setBalance }) {
const [privateKey, setPrivateKey] = useState("");
const [hashedMessage, setHashedMessage] = useState("");
const [signature, setSignature] = useState("");
const [recoveryBit, setRecoveryBit] = useState("");


  async function onChange(evt) {
    const newaddress = evt.target.value;
    setAddress(newaddress);
    if (newaddress) {
      const {
        data: { balance , privateKey, hashedMessage,signature,recoveryBit},
      } = await server.get(`balance/${newaddress}`);
      setBalance(balance);
      setPrivateKey(privateKey);
      setHashedMessage(hashedMessage);
      setSignature(signature);
      setRecoveryBit(recoveryBit);
    } else {
      setBalance(0);
      setPrivateKey("");
      setHashedMessage("");
      setSignature("");
      setRecoveryBit("");
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
      <div className="private-key">Private Key: {privateKey}</div>
      <div className="hashed-message">Hashed Message: {hashedMessage}</div>
      <div className="signature">Signature: {signature}</div>
      <div className="recovery-bit">Recovery Bit: {recoveryBit}</div>
    </div>
  );
}

export default Wallet;
