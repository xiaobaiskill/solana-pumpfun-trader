import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

export async function getKeyPairFromPrivateKey(key: string) {
    return Keypair.fromSecretKey(new Uint8Array(bs58.decode(key)));
}

export function bufferFromUInt64(value: number | string) {
    let buffer = Buffer.alloc(8);
    buffer.writeBigUInt64LE(BigInt(value));
    return buffer;
}

export function bufferFromUInt32(value: number) {
    let buffer = Buffer.alloc(4);
    buffer.writeUIntLE(value, 0, 4);
    return buffer;
}

export function bufferFromUInt(value: number, size: number) {
    let buffer = Buffer.alloc(size);
    buffer.writeUIntLE(value, 0, size);
    return buffer;
}
