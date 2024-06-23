import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction, clusterApiUrl } from '@solana/web3.js';
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { createTransaction } from './utils/create-transaction';
import { sendTransaction } from './utils/send-transaction';
import { bufferFromUInt64, getKeyPairFromPrivateKey } from './utils/helper';
import getCoinData from './utils/get-token-data';
import 'dotenv/config';
import getTokenData from './utils/get-token-data';
export const GLOBAL = new PublicKey('4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf');
export const FEE_RECIPIENT = new PublicKey('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const ASSOC_TOKEN_ACC_PROG = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
export const RENT = new PublicKey('SysvarRent111111111111111111111111111111111');
export const COMPUTEBUDGET = new PublicKey('ComputeBudget111111111111111111111111111111');
export const PUMP_FUN_PROGRAM = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');
export const PUMP_FUN_ACCOUNT = new PublicKey('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1');
export const SYSTEM_PROGRAM_ID = SystemProgram.programId;

export default class PumpFunTrader {
    private connection: Connection;
    private logger: any;

    constructor(connection: Connection, logger: any = console) {
        this.connection = connection;
        this.logger = logger;
    }

    setLogger(logger: any) {
        this.logger = logger;
        return this;
    }

    async getBuyTransaction(publicKey: string, tokenAddress: string, amount: number, slippage: number = 0.10, priorityFee: number = 0) {
        const coinData = await getTokenData(tokenAddress, this.logger);
        if (!coinData) {
            this.logger.error('Failed to retrieve coin data...');
            return;
        }

        const owner = new PublicKey(publicKey);
        // 获取最近的 blockhash
        const { blockhash } = await this.connection.getLatestBlockhash();
        const txBuilder = new Transaction({
            feePayer: owner,
            recentBlockhash: blockhash,
        });
        const token = new PublicKey(tokenAddress);

        const tokenAccountAddress = await getAssociatedTokenAddress(token, owner, false);

        const tokenAccountInfo = await this.connection.getAccountInfo(tokenAccountAddress);

        if (priorityFee > 0) {

        }

        let tokenAccount: PublicKey;
        if (!tokenAccountInfo) {
            txBuilder.add(
                createAssociatedTokenAccountInstruction(owner, tokenAccountAddress, owner, token)
            );
            tokenAccount = tokenAccountAddress;
        } else {
            tokenAccount = tokenAccountAddress;
        }

        const solInLamports = amount * LAMPORTS_PER_SOL;
        const tokenOut = Math.floor((solInLamports * coinData['virtual_token_reserves']) / coinData['virtual_sol_reserves']);

        const amountWithSlippage = amount * (1 + slippage);
        const maxSolCost = Math.floor(amountWithSlippage * LAMPORTS_PER_SOL);
        const ASSOCIATED_USER = tokenAccount;
        const USER = owner;
        const BONDING_CURVE = new PublicKey(coinData['bonding_curve']);
        const ASSOCIATED_BONDING_CURVE = new PublicKey(coinData['associated_bonding_curve']);

        const keys = [
            { pubkey: GLOBAL, isSigner: false, isWritable: false },
            { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true },
            { pubkey: token, isSigner: false, isWritable: false },
            { pubkey: BONDING_CURVE, isSigner: false, isWritable: true },
            { pubkey: ASSOCIATED_BONDING_CURVE, isSigner: false, isWritable: true },
            { pubkey: ASSOCIATED_USER, isSigner: false, isWritable: true },
            { pubkey: USER, isSigner: false, isWritable: true },
            { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: RENT, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_ACCOUNT, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_PROGRAM, isSigner: false, isWritable: false }
        ];
        const data = Buffer.concat([bufferFromUInt64('16927863322537952870'), bufferFromUInt64(tokenOut), bufferFromUInt64(maxSolCost)]);

        const instruction = new TransactionInstruction({
            keys: keys,
            programId: PUMP_FUN_PROGRAM,
            data: data
        });

        txBuilder.add(instruction)
        return txBuilder
    }
    async getSellTransaction(publicKey: string, tokenAddress: string, tokenBalance: number, slippage: number = 0.25, priorityFee: number = 0) {
        const coinData = await getCoinData(tokenAddress);
        if (!coinData) {
            this.logger.error('Failed to retrieve coin data...');
            return;
        }

        const { blockhash } = await this.connection.getLatestBlockhash();
        const owner = new PublicKey(publicKey);
        const mint = new PublicKey(tokenAddress);
        const txBuilder = new Transaction({
            feePayer: owner,
            recentBlockhash: blockhash,
        });

        if (priorityFee > 0) {

        }

        const tokenAccountAddress = await getAssociatedTokenAddress(mint, owner, false);

        const tokenAccountInfo = await this.connection.getAccountInfo(tokenAccountAddress);

        let tokenAccount: PublicKey;
        if (!tokenAccountInfo) {
            txBuilder.add(createAssociatedTokenAccountInstruction(owner, tokenAccountAddress, owner, mint));
            tokenAccount = tokenAccountAddress;
        } else {
            tokenAccount = tokenAccountAddress;
        }

        const minSolOutput = Math.floor((tokenBalance! * (1 - slippage) * coinData['virtual_sol_reserves']) / coinData['virtual_token_reserves']);

        const keys = [
            { pubkey: GLOBAL, isSigner: false, isWritable: false },
            { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true },
            { pubkey: mint, isSigner: false, isWritable: false },
            { pubkey: new PublicKey(coinData['bonding_curve']), isSigner: false, isWritable: true },
            { pubkey: new PublicKey(coinData['associated_bonding_curve']), isSigner: false, isWritable: true },
            { pubkey: tokenAccount, isSigner: false, isWritable: true },
            { pubkey: owner, isSigner: false, isWritable: true },
            { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: ASSOC_TOKEN_ACC_PROG, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_ACCOUNT, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_PROGRAM, isSigner: false, isWritable: false }
        ];

        const data = Buffer.concat([bufferFromUInt64('12502976635542562355'), bufferFromUInt64(tokenBalance), bufferFromUInt64(minSolOutput)]);

        const instruction = new TransactionInstruction({
            keys: keys,
            programId: PUMP_FUN_PROGRAM,
            data: data
        });

        txBuilder.add(instruction);

        return txBuilder;
    }
}
