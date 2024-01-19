const { getRandomBytesSync } = require("ethereum-cryptography/random");
const { toHex } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

// Use getRandomBytesSync to generate a random private key
const privateKey = getRandomBytesSync(32); // 32 bytes for a 256-bit private key
console.log('Private Key:', toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey);
console.log('Public Key:', toHex(publicKey));

// Calculate the address from the public key
const addressBuffer = keccak256(publicKey.slice(1)).slice(-20);
const address = "0x" + toHex(addressBuffer);

console.log('Address:', address);
