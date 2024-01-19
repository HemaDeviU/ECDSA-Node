const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { keccak256, toHex } = require("ethereum-cryptography/utils.js");

app.use(cors());
app.use(express.json());

const balances = {
  "0x3a114306ba69d0af73999c2814d553f7f8ba85e8": 100,
  "0xb366691822f09e80f6db0de1d8f02bf66ab602d5": 50,
  "0x109c9672b7cdb3c60092a5ba6a6e2fefefb5248c": 75,
};
const privateKeys = {
  "0x3a114306ba69d0af73999c2814d553f7f8ba85e8": "8df668b259f3b8a66efe9bf8dfe20f8dc9fc396bedc4afe37a84af9ba1f86bf7",
  "0xb366691822f09e80f6db0de1d8f02bf66ab602d5": "9bd8f59f496002b21fcb6d798bfc680b3b5b875d15590f956324ce23d9ce247c",
  "0x109c9672b7cdb3c60092a5ba6a6e2fefefb5248c": "438f61e4736ba21250d8c65898c702c5561c20b687e671f0f7a028abf332317f"
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  const privateKey = privateKeys[address];
  res.send({ balance ,privateKey});
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, hexMessage, recoveryBit} = req.body;
  const signaturePublicKey = secp.recoverPublicKey(hexMessage, signature, recoveryBit);
  const signatureAddressNotHex = keccak256(signaturePublicKey.slice(1)).slice(-20);
  const signatureAddress = "0x" + toHex(signatureAddressNotHex);
  if (signatureAddress !== sender) {
    res.status(400).send({message: "You are not the person!"})
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
