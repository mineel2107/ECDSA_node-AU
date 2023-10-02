const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { sha256 } = require("ethereum-cryptography/sha256");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");

app.use(cors());
app.use(express.json());

// Private Key : b36d66e11eb2a2936b235cc776fa613743892a25ba5f00510f081ea54f39b838
// Public Key : 02faddcfeb18599f00f09b49ad36edeb2df746f3d763ce0dc1cb5672688999b191

// Private Key : 021a07ac74b17f7754aac7423411b2d345774f80331e34307d64fe9cc0e0e2dc
// Public Key : 02d964cd3dc074451f2cab3bb7b294360c8cd5859caacebf76e1eb493f7b6b745f

const balances = {
  "02faddcfeb18599f00f09b49ad36edeb2df746f3d763ce0dc1cb5672688999b191": 100,
  "02d964cd3dc074451f2cab3bb7b294360c8cd5859caacebf76e1eb493f7b6b745f": 50,
  "032a62842c9ae5a42dfcae33e3ffddeb100985e673d6e9cd6bf8340f5285d93e1a": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO: get a signature from client-side application
  // recover the public address from the signature

  const { sender, recipient, amount, sign } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  signature.r = BigInt(signature.r);
  signature.s = BigInt(signature.s);

  const msgHash = sha256(utf8ToBytes(amount.toString()));

  if (secp256k1.verify(signature, msgHash, sender)) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: "Authentication Failed" });
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
