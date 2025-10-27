import { hmac } from '@noble/hashes/hmac';
import { sha512 } from '@noble/hashes/sha512';
import { Buffer } from 'buffer';

const ED25519_CURVE = Buffer.from('ed25519 seed', 'utf8');
const HARDENED_OFFSET = 0x80000000;
const PATH_REGEX = new RegExp("^m(\\/[0-9]+'?)+$");

function replaceDerive(segment) {
  return segment.replace("'", '');
}

function getMasterKeyFromSeed(seed) {
  const seedBuffer = typeof seed === 'string' ? Buffer.from(seed, 'hex') : Buffer.from(seed);
  const I = hmac(sha512, ED25519_CURVE, seedBuffer);
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: Buffer.from(IL),
    chainCode: Buffer.from(IR),
  };
}

function ckdPriv({ key, chainCode }, index) {
  const indexBuffer = Buffer.allocUnsafe(4);
  indexBuffer.writeUInt32BE(index, 0);
  const data = Buffer.concat([Buffer.alloc(1, 0), Buffer.from(key), indexBuffer]);
  const I = hmac(sha512, chainCode, data);
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: Buffer.from(IL),
    chainCode: Buffer.from(IR),
  };
}

export function derivePath(path, seed, offset = HARDENED_OFFSET) {
  if (!PATH_REGEX.test(path)) {
    throw new Error('Invalid derivation path');
  }

  const { key, chainCode } = getMasterKeyFromSeed(seed);
  const segments = path
    .split('/')
    .slice(1)
    .map(replaceDerive)
    .map((el) => parseInt(el, 10));

  return segments.reduce((parentKeys, segment) => ckdPriv(parentKeys, segment + offset), {
    key,
    chainCode,
  });
}
