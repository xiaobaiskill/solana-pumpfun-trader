const PumpFunTrader = require('./dist/index.js').default;
require('dotenv').config();

const web3 = require("@solana/web3.js");
const base58 = require('bs58');

async function testBuy() {
    const pay = web3.Keypair.fromSecretKey(base58.decode(process.env.SECRET_KEY))
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
        const pumpFunTrader = new PumpFunTrader(connection);

        const tx = await pumpFunTrader.getBuyTransaction(pay.publicKey, "2WMY1ishGato1dTjP2bCBg6eTANXcY2ETugjx1dADsPt", 0.001)

        tx.sign(pay)

        console.log(tx)
        console.log("")
        console.log("-------------------- send transaction --------------------")
        console.log("")

        const res = await connection.simulateTransaction(tx)
        console.log(res)
        console.log(res.value.err)

        // const signture = await web3.sendAndConfirmTransaction(connection, tx, [pay])
        // console.log(signture)
    } catch (error) {
        console.error('error', error);
    }
}

testBuy();
