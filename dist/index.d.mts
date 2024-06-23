import { PublicKey, Connection, Transaction } from '@solana/web3.js';

declare const GLOBAL: PublicKey;
declare const FEE_RECIPIENT: PublicKey;
declare const TOKEN_PROGRAM_ID: PublicKey;
declare const ASSOC_TOKEN_ACC_PROG: PublicKey;
declare const RENT: PublicKey;
declare const COMPUTEBUDGET: PublicKey;
declare const PUMP_FUN_PROGRAM: PublicKey;
declare const PUMP_FUN_ACCOUNT: PublicKey;
declare const SYSTEM_PROGRAM_ID: PublicKey;
declare const BLOX_ROUTE: PublicKey;
declare class PumpFunTrader {
    private connection;
    private logger;
    constructor(connection: Connection, logger?: any);
    setLogger(logger: any): this;
    getBuyTransaction(publicKey: string, tokenAddress: string, amount: number, slippage?: number, priorityFee?: number): Promise<Transaction | undefined>;
    getSellTransaction(publicKey: string, tokenAddress: string, tokenBalance: number, slippage?: number, priorityFee?: number): Promise<Transaction | undefined>;
    private setpriorityFee;
}

export { ASSOC_TOKEN_ACC_PROG, BLOX_ROUTE, COMPUTEBUDGET, FEE_RECIPIENT, GLOBAL, PUMP_FUN_ACCOUNT, PUMP_FUN_PROGRAM, RENT, SYSTEM_PROGRAM_ID, TOKEN_PROGRAM_ID, PumpFunTrader as default };
