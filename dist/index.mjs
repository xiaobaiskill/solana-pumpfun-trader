var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.ts
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from "@solana/spl-token";

// src/utils/helper.ts
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
function bufferFromUInt64(value) {
  let buffer = Buffer.alloc(8);
  buffer.writeBigUInt64LE(BigInt(value));
  return buffer;
}
__name(bufferFromUInt64, "bufferFromUInt64");
function bufferFromUInt32(value) {
  let buffer = Buffer.alloc(4);
  buffer.writeUIntLE(value, 0, 4);
  return buffer;
}
__name(bufferFromUInt32, "bufferFromUInt32");

// src/utils/get-token-data.ts
import axios from "axios";
async function getTokenData(mintStr, logger = console) {
  try {
    const url = `https://frontend-api.pump.fun/coins/${mintStr}`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: "https://www.pump.fun/",
        Origin: "https://www.pump.fun",
        Connection: "keep-alive",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "If-None-Match": 'W/"43a-tWaCcS4XujSi30IFlxDCJYxkMKg"'
      }
    });
    if (response.status === 200) {
      return response.data;
    } else {
      logger.error("Failed to retrieve coin data:", response.status);
      return null;
    }
  } catch (error) {
    logger.error("Error fetching coin data:", error);
    return null;
  }
}
__name(getTokenData, "getTokenData");

// src/index.ts
import "dotenv/config";
var GLOBAL = new PublicKey("4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf");
var FEE_RECIPIENT = new PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM");
var TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
var ASSOC_TOKEN_ACC_PROG = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
var RENT = new PublicKey("SysvarRent111111111111111111111111111111111");
var COMPUTEBUDGET = new PublicKey("ComputeBudget111111111111111111111111111111");
var PUMP_FUN_PROGRAM = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
var PUMP_FUN_ACCOUNT = new PublicKey("Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1");
var SYSTEM_PROGRAM_ID = SystemProgram.programId;
var BLOX_ROUTE = new PublicKey("HWEoBxYs7ssKuudEjzjmpfJVX7Dvi7wescFsVx2L5yoY");
var PumpFunTrader = class {
  static {
    __name(this, "PumpFunTrader");
  }
  connection;
  logger;
  constructor(connection, logger = console) {
    this.connection = connection;
    this.logger = logger;
  }
  setLogger(logger) {
    this.logger = logger;
    return this;
  }
  async getBuyTransaction(publicKey, tokenAddress, amount, slippage = 0.1, priorityFee = 3e-3) {
    const coinData = await getTokenData(tokenAddress, this.logger);
    if (!coinData) {
      this.logger.error("Failed to retrieve coin data...");
      return;
    }
    const owner = new PublicKey(publicKey);
    const { blockhash } = await this.connection.getLatestBlockhash();
    const txBuilder = new Transaction({
      feePayer: owner,
      recentBlockhash: blockhash
    });
    const token = new PublicKey(tokenAddress);
    const tokenAccountAddress = await getAssociatedTokenAddress(token, owner, false);
    const tokenAccountInfo = await this.connection.getAccountInfo(tokenAccountAddress);
    if (priorityFee > 0) {
      this.setpriorityFee(txBuilder, owner, priorityFee);
    }
    let tokenAccount;
    if (!tokenAccountInfo) {
      txBuilder.add(createAssociatedTokenAccountInstruction(owner, tokenAccountAddress, owner, token));
      tokenAccount = tokenAccountAddress;
    } else {
      tokenAccount = tokenAccountAddress;
    }
    const solInLamports = amount * LAMPORTS_PER_SOL;
    const tokenOut = Math.floor(solInLamports * coinData["virtual_token_reserves"] / coinData["virtual_sol_reserves"]);
    const amountWithSlippage = amount * (1 + slippage);
    const maxSolCost = Math.floor(amountWithSlippage * LAMPORTS_PER_SOL);
    const ASSOCIATED_USER = tokenAccount;
    const USER = owner;
    const BONDING_CURVE = new PublicKey(coinData["bonding_curve"]);
    const ASSOCIATED_BONDING_CURVE = new PublicKey(coinData["associated_bonding_curve"]);
    const keys = [
      {
        pubkey: GLOBAL,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: FEE_RECIPIENT,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: token,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: BONDING_CURVE,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: ASSOCIATED_BONDING_CURVE,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: ASSOCIATED_USER,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: USER,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: SYSTEM_PROGRAM_ID,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: RENT,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: PUMP_FUN_ACCOUNT,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: PUMP_FUN_PROGRAM,
        isSigner: false,
        isWritable: false
      }
    ];
    const data = Buffer.concat([
      bufferFromUInt64("16927863322537952870"),
      bufferFromUInt64(tokenOut),
      bufferFromUInt64(maxSolCost)
    ]);
    const instruction = new TransactionInstruction({
      keys,
      programId: PUMP_FUN_PROGRAM,
      data
    });
    txBuilder.add(instruction);
    return txBuilder;
  }
  async getSellTransaction(publicKey, tokenAddress, tokenBalance, slippage = 0.25, priorityFee = 3e-3) {
    const coinData = await getTokenData(tokenAddress);
    if (!coinData) {
      this.logger.error("Failed to retrieve coin data...");
      return;
    }
    const { blockhash } = await this.connection.getLatestBlockhash();
    const owner = new PublicKey(publicKey);
    const mint = new PublicKey(tokenAddress);
    const txBuilder = new Transaction({
      feePayer: owner,
      recentBlockhash: blockhash
    });
    if (priorityFee > 0) {
      this.setpriorityFee(txBuilder, owner, priorityFee);
    }
    const tokenAccountAddress = await getAssociatedTokenAddress(mint, owner, false);
    const tokenAccountInfo = await this.connection.getAccountInfo(tokenAccountAddress);
    let tokenAccount;
    if (!tokenAccountInfo) {
      txBuilder.add(createAssociatedTokenAccountInstruction(owner, tokenAccountAddress, owner, mint));
      tokenAccount = tokenAccountAddress;
    } else {
      tokenAccount = tokenAccountAddress;
    }
    const minSolOutput = Math.floor(tokenBalance * (1 - slippage) * coinData["virtual_sol_reserves"] / coinData["virtual_token_reserves"]);
    const keys = [
      {
        pubkey: GLOBAL,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: FEE_RECIPIENT,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: mint,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: new PublicKey(coinData["bonding_curve"]),
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: new PublicKey(coinData["associated_bonding_curve"]),
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: tokenAccount,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: owner,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: SYSTEM_PROGRAM_ID,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: ASSOC_TOKEN_ACC_PROG,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: PUMP_FUN_ACCOUNT,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: PUMP_FUN_PROGRAM,
        isSigner: false,
        isWritable: false
      }
    ];
    const data = Buffer.concat([
      bufferFromUInt64("12502976635542562355"),
      bufferFromUInt64(tokenBalance),
      bufferFromUInt64(minSolOutput)
    ]);
    const instruction = new TransactionInstruction({
      keys,
      programId: PUMP_FUN_PROGRAM,
      data
    });
    txBuilder.add(instruction);
    return txBuilder;
  }
  setpriorityFee(txBuilder, owner, priorityFee) {
    const data = Buffer.concat([
      bufferFromUInt32(2),
      bufferFromUInt64(priorityFee * LAMPORTS_PER_SOL)
    ]);
    txBuilder.add(new TransactionInstruction({
      keys: [
        {
          pubkey: owner,
          isSigner: true,
          isWritable: true
        },
        {
          pubkey: BLOX_ROUTE,
          isSigner: false,
          isWritable: true
        }
      ],
      programId: SYSTEM_PROGRAM_ID,
      data
    }));
  }
};
export {
  ASSOC_TOKEN_ACC_PROG,
  BLOX_ROUTE,
  COMPUTEBUDGET,
  FEE_RECIPIENT,
  GLOBAL,
  PUMP_FUN_ACCOUNT,
  PUMP_FUN_PROGRAM,
  RENT,
  SYSTEM_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  PumpFunTrader as default
};
