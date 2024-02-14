const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { keccak256, toHex } = require("ethereum-cryptography/utils.js");
app.use(cors());
app.use(express.json());

const balances = {
  "0x47827c0f8fb136bfbb8f519f559d36c00917fac8": 100,
  "0x161780f0a9cb58afa006555628ca1957034bfe59": 50,
  "0xf54594885301d047caadda4e8cdec3a619de3c7b": 75,
};
const privateKeys = {
  "0x47827c0f8fb136bfbb8f519f559d36c00917fac8": "8f90b824a25415edac0f8106583f3664cae37a04949636cedddc4f73a2a448fe",
  "0x161780f0a9cb58afa006555628ca1957034bfe59": "64b8cf6e3f6d1d18ef9aa254f421e465ac3bff1fc750b549671b349e6a6578d3",
  "0xf54594885301d047caadda4e8cdec3a619de3c7b": "f56ea4fb1313641bcf48c1ed0c52333aa6093c92d27b5326b4ec4c1b791dcefa"
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  const privateKey = privateKeys[address];
  res.send({ balance, privateKey });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, hexMessage, recoveryBit } = req.body;
  const signaturePublicKey = secp.recoverPublicKey(hexMessage, signature, recoveryBit);
  const signatureAddressNotHex = keccak256(signaturePublicKey.slice(1)).slice(-20);
  const signatureAddress = "0x" + toHex(signatureAddressNotHex);
  if (signatureAddress !== sender) {
    res.status(400).send({ message: "You are not the person!" })
  }
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
