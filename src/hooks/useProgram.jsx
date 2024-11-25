import { useMemo } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import idl from "../idl/contract.idl.json";

const network = "https://api.devnet.solana.com";
const programID = new PublicKey("BZux6McmrjjyDHkYMtnoivgbsoKMRwRSficXMxcCVwR2"); // program ID
const opts = {
  preflightCommitment: "processed",
};

// Custom hook to get the provider
export const useProvider = () => {
  const wallet = useWallet();

  const provider = useMemo(() => {
    const connection = new Connection(network, opts.preflightCommitment);
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    return new Provider(connection, wallet, opts);
  }, [wallet]);

  return provider;
};

// Custom hook to get the program
export const useProgram = () => {
  const provider = useProvider();

  const program = useMemo(() => {
    return new Program(idl, programID, provider);
  }, [provider]);

  return program;
};
