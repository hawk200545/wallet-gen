import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist as englishWordlist } from '@scure/bip39/wordlists/english';
import { HDKey } from '@scure/bip32';
import { base58 } from '@scure/base';
import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { keccak_256 } from '@noble/hashes/sha3';
import { secp256k1 } from '@noble/curves/secp256k1';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { derivePath } from './slip10';
import { Buffer } from 'buffer';

const COIN_TYPE = {
  bitcoin: 0,
  ethereum: 60,
  solana: 501,
};

const englishWords = englishWordlist;

function toHex(bytes) {
  return Buffer.from(bytes).toString('hex');
}

function deriveBitcoinKeys(seed, index) {
  const root = HDKey.fromMasterSeed(seed);
  const path = `m/44'/${COIN_TYPE.bitcoin}'/${index}'/0'`;
  const child = root.derive(path);

  if (!child.privateKey || !child.publicKey) {
    throw new Error('Bitcoin key derivation failed');
  }

  const pubKeyHash = ripemd160(sha256(child.publicKey));
  const payload = new Uint8Array(pubKeyHash.length + 1);
  payload[0] = 0x00; // mainnet
  payload.set(pubKeyHash, 1);
  const publicKey = base58CheckEncode(payload);

  const privKey = child.privateKey;
  const wifPayload = new Uint8Array(privKey.length + 2);
  wifPayload[0] = 0x80;
  wifPayload.set(privKey, 1);
  wifPayload[wifPayload.length - 1] = 0x01; // compressed flag
  const privateKey = base58CheckEncode(wifPayload);

  return { publicKey, privateKey };
}

function deriveEthereumKeys(seed, index) {
  const root = HDKey.fromMasterSeed(seed);
  const path = `m/44'/${COIN_TYPE.ethereum}'/${index}'/0'`;
  const child = root.derive(path);

  if (!child.privateKey) {
    throw new Error('Ethereum key derivation failed');
  }

  const privateKeyHex = toHex(child.privateKey);
  const uncompressedPublicKey = secp256k1.getPublicKey(child.privateKey, false);
  const publicKeyHash = keccak_256(uncompressedPublicKey.slice(1));
  const address = `0x${Buffer.from(publicKeyHash.slice(-20)).toString('hex')}`;

  return {
    privateKey: `0x${privateKeyHex}`,
    publicKey: address,
  };
}

function deriveSolanaKeys(seed, index) {
  const path = `m/44'/${COIN_TYPE.solana}'/${index}'/0'`;
  const derivedSeed = derivePath(path, Buffer.from(seed).toString('hex')).key;
  const keypair = nacl.sign.keyPair.fromSeed(derivedSeed);

  return {
    publicKey: bs58.encode(keypair.publicKey),
    privateKey: bs58.encode(keypair.secretKey),
  };
}

export function generateWalletKeys(mnemonic, index, coinType) {
  if (!validateMnemonic(mnemonic, englishWords)) {
    throw new Error('Invalid mnemonic phrase');
  }

  if (!Object.prototype.hasOwnProperty.call(COIN_TYPE, coinType)) {
    throw new Error(`Unsupported coin type: ${coinType}`);
  }

  const seed = mnemonicToSeedSync(mnemonic);

  switch (coinType) {
    case 'bitcoin':
      return { ...deriveBitcoinKeys(seed, index), coinType, index };
    case 'ethereum':
      return { ...deriveEthereumKeys(seed, index), coinType, index };
    case 'solana':
      return { ...deriveSolanaKeys(seed, index), coinType, index };
    default:
      throw new Error('Unsupported coin type');
  }
}

export function generateSecureMnemonic() {
  return generateMnemonic(englishWords, 256);
}

export { validateMnemonic };

function base58CheckEncode(payload) {
  const checksum = sha256(sha256(payload)).slice(0, 4);
  const result = new Uint8Array(payload.length + checksum.length);
  result.set(payload);
  result.set(checksum, payload.length);
  return base58.encode(result);
}
