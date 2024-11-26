import * as web3 from "@solana/web3.js";

export const CONTRACT_ADDRESS = "0x5825D8Aeb7A46B9DE858dF8aaE7a7898dA97b61e";

export const RIDE_STATUS = ["Created", "Accepted", "Completed", "Cancelled"];

export const PROGRAM_ID = new web3.PublicKey(
  "2D9odUcyGQ51WPED4y2NAW2WEe9Z5XGRsRLnZgXAh6wy"
);

// export const PROGRAM_ID = "EF7ZgKpTgPMjBZDVEPj65UGy5cb831U5R3QfKep3vt7n";
export const NETWORK = "https://rpc.testnet.soo.network/rpc";

export const CONNECTION = new web3.Connection(
  "https://rpc.testnet.soo.network/rpc"
);

// https://gist.github.com/Abbas-Dev-786/09b988c88db02094a7d7ae4b628fcb69
