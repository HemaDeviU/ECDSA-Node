import { keccak256 } from "ethereum-cryptography/keccak.js";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";

import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { useState } from 'react';
import server from './server';



async function hashAndSign({ address, privateKey, setHashedMessage, setSignature, setRecoveryBit, sendAmount, recipient }) {
  try {
    const privateKeyBytes = hexToBytes(privateKey);
    const transactionMessage = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient: recipient,
    };
    const hashedMessage = keccak256(utf8ToBytes(JSON.stringify(transactionMessage)));
    const hexMessage = toHex(hashedMessage);

    setHashedMessage(hexMessage);
    const signatureObj= secp256k1.sign(hexMessage, privateKeyBytes);
    const signature = toHex(signatureObj.r)+toHex(signatureObj.s);
    setSignature(signature);
    const recoveryBit = signatureObj.recovery;
    setRecoveryBit(recoveryBit);
  }
  catch (error) {
    console.error("Error in hashAndSign", error);
  }
}
function Transfer({ address, setBalance,privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [hashedMessage, setHashedMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [recoveryBit, setRecoveryBit] = useState("");
const privateKeyBytes = hexToBytes(privateKey);
  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      await hashAndSign({ address, privateKeyBytes, setHashedMessage, setSignature, setRecoveryBit, sendAmount, recipient });
      const response = await server.post(`send`, {

        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
        recoveryBit,
        hexMessage: hashedMessage,
      });
      const balance = response?.data?.balance;
      if (balance !== undefined) {
        setBalance(balance);
      }
      else {
        console.error("balance not available in the server response");
      }

    } catch (ex) {
      console.error("Error in transfer", ex);
      if (ex?.response) {
        console.error("server error:", ex.response.data.message);
      }
      else {

        console.error("fix the error:", ex.message);
      }
    }

  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
