"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ASSOC_TOKEN_ACC_PROG: () => ASSOC_TOKEN_ACC_PROG,
  BLOX_ROUTE: () => BLOX_ROUTE,
  COMPUTEBUDGET: () => COMPUTEBUDGET,
  FEE_RECIPIENT: () => FEE_RECIPIENT,
  GLOBAL: () => GLOBAL,
  PUMP_FUN_ACCOUNT: () => PUMP_FUN_ACCOUNT,
  PUMP_FUN_PROGRAM: () => PUMP_FUN_PROGRAM,
  RENT: () => RENT,
  SYSTEM_PROGRAM_ID: () => SYSTEM_PROGRAM_ID,
  TOKEN_PROGRAM_ID: () => TOKEN_PROGRAM_ID,
  default: () => PumpFunTrader
});
module.exports = __toCommonJS(src_exports);
var import_web32 = require("@solana/web3.js");
var import_spl_token = require("@solana/spl-token");

// src/utils/helper.ts
var import_web3 = require("@solana/web3.js");
var import_bs58 = __toESM(require("bs58"));
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
var import_axios = __toESM(require("axios"));
async function getTokenData(mintStr, logger = console) {
  try {
    const url = `https://frontend-api.pump.fun/coins/${mintStr}`;
    const response = await import_axios.default.get(url, {
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
var GLOBAL = new import_web32.PublicKey("4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf");
var FEE_RECIPIENT = new import_web32.PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM");
var TOKEN_PROGRAM_ID = new import_web32.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
var ASSOC_TOKEN_ACC_PROG = new import_web32.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
var RENT = new import_web32.PublicKey("SysvarRent111111111111111111111111111111111");
var COMPUTEBUDGET = new import_web32.PublicKey("ComputeBudget111111111111111111111111111111");
var PUMP_FUN_PROGRAM = new import_web32.PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
var PUMP_FUN_ACCOUNT = new import_web32.PublicKey("Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1");
var SYSTEM_PROGRAM_ID = import_web32.SystemProgram.programId;
var BLOX_ROUTE = new import_web32.PublicKey("HWEoBxYs7ssKuudEjzjmpfJVX7Dvi7wescFsVx2L5yoY");
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
  // name: name
  // symbol: ticker
  // uri: get url before post data to https://pump.fun/api/ipfs 
  // example: https://solscan.io/tx/217i15JPriGAKR56dNqzjkdeki8DA6FE72JcXoyD5QDPd2beEDJVYgWUeab7aNn1zx2964N6rwUWKm83D5ZjR4Aq
  // example: https://solscan.io/tx/5Pk5BZKbdfE6umR5ZeP7cgfnDBJMq2UEdFpUdwzFMjGCCc9n4z1qs5qxyZ3vT2vRvreNSYERd2qgjoVedqwdquFK
  async createMeme(name, symbol, uri) {
  }
  async getBuyTransaction(publicKey, tokenAddress, amount, slippage = 0.1, priorityFee = 3e-3) {
    const coinData = await getTokenData(tokenAddress, this.logger);
    if (!coinData) {
      this.logger.error("Failed to retrieve coin data...");
      return;
    }
    const owner = new import_web32.PublicKey(publicKey);
    const { blockhash } = await this.connection.getLatestBlockhash();
    const txBuilder = new import_web32.Transaction({
      feePayer: owner,
      recentBlockhash: blockhash
    });
    const token = new import_web32.PublicKey(tokenAddress);
    const tokenAccountAddress = await (0, import_spl_token.getAssociatedTokenAddress)(token, owner, false);
    const tokenAccountInfo = await this.connection.getAccountInfo(tokenAccountAddress);
    if (priorityFee > 0) {
      this.setpriorityFee(txBuilder, owner, priorityFee);
    }
    let tokenAccount;
    if (!tokenAccountInfo) {
      txBuilder.add((0, import_spl_token.createAssociatedTokenAccountInstruction)(owner, tokenAccountAddress, owner, token));
      tokenAccount = tokenAccountAddress;
    } else {
      tokenAccount = tokenAccountAddress;
    }
    const solInLamports = amount * import_web32.LAMPORTS_PER_SOL;
    const tokenOut = Math.floor(solInLamports * coinData["virtual_token_reserves"] / coinData["virtual_sol_reserves"]);
    const amountWithSlippage = amount * (1 + slippage);
    const maxSolCost = Math.floor(amountWithSlippage * import_web32.LAMPORTS_PER_SOL);
    const ASSOCIATED_USER = tokenAccount;
    const USER = owner;
    const BONDING_CURVE = new import_web32.PublicKey(coinData["bonding_curve"]);
    const ASSOCIATED_BONDING_CURVE = new import_web32.PublicKey(coinData["associated_bonding_curve"]);
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
    const instruction = new import_web32.TransactionInstruction({
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
    const owner = new import_web32.PublicKey(publicKey);
    const mint = new import_web32.PublicKey(tokenAddress);
    const txBuilder = new import_web32.Transaction({
      feePayer: owner,
      recentBlockhash: blockhash
    });
    if (priorityFee > 0) {
      this.setpriorityFee(txBuilder, owner, priorityFee);
    }
    const tokenAccountAddress = await (0, import_spl_token.getAssociatedTokenAddress)(mint, owner, false);
    const tokenAccountInfo = await this.connection.getAccountInfo(tokenAccountAddress);
    let tokenAccount;
    if (!tokenAccountInfo) {
      txBuilder.add((0, import_spl_token.createAssociatedTokenAccountInstruction)(owner, tokenAccountAddress, owner, mint));
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
        pubkey: new import_web32.PublicKey(coinData["bonding_curve"]),
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: new import_web32.PublicKey(coinData["associated_bonding_curve"]),
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
    const instruction = new import_web32.TransactionInstruction({
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
      bufferFromUInt64(priorityFee * import_web32.LAMPORTS_PER_SOL)
    ]);
    txBuilder.add(new import_web32.TransactionInstruction({
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ASSOC_TOKEN_ACC_PROG,
  BLOX_ROUTE,
  COMPUTEBUDGET,
  FEE_RECIPIENT,
  GLOBAL,
  PUMP_FUN_ACCOUNT,
  PUMP_FUN_PROGRAM,
  RENT,
  SYSTEM_PROGRAM_ID,
  TOKEN_PROGRAM_ID
});
