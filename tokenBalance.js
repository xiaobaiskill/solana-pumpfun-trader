require('dotenv').config();
// import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
const spl = require("@solana/spl-token")
const web3 = require("@solana/web3.js");
const base58 = require('bs58');

async function getTokenBalance() {
    const token = new web3.PublicKey("2WMY1ishGato1dTjP2bCBg6eTANXcY2ETugjx1dADsPt")

    const pay = web3.Keypair.fromSecretKey(base58.decode(process.env.SECRET_KEY))
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));

        const tokenAccountAddress = await spl.getAssociatedTokenAddress(token, pay.publicKey, false);

        const data = await connection.getParsedAccountInfo(tokenAccountAddress)
        console.log(data)
        console.log(data.value.data.parsed.info.tokenAmount)
        console.log(data.value.data.parsed.info.tokenAmount.uiAmount)

    } catch (error) {
        console.error('error', error);
    }
}

getTokenBalance();
