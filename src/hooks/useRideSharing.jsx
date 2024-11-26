import * as anchor from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

import { Buffer } from "buffer";

// Ensure Buffer is globally available (for browser environments)
window.Buffer = Buffer;

// Import your IDL (generated from the JSON)
import IDL from "../idl/contract.idl.json";
import { CONNECTION, NETWORK, PROGRAM_ID } from "../constant";
import { sendTransaction } from "viem/actions";
import { AnchorProvider } from "@project-serum/anchor";

// Custom hook for interacting with the ride-sharing program
export const useRideSharingProgram = () => {
  const wallet = useWallet();
  const [program, setProgram] = useState(null);

  // get provider
  const getProvider = () => {
    const provider = new anchor.AnchorProvider(
      CONNECTION,
      wallet,
      anchor.AnchorProvider.defaultOptions()
    );
    anchor.setProvider(provider);
    return provider;
  };

  // Initialize the program connection
  const initializeProgram = async () => {
    if (!wallet.connected) {
      throw new Error("Wallet not connected");
    }

    const connection = new web3.Connection(NETWORK, "confirmed");
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });

    const programInstance = new anchor.Program(IDL, PROGRAM_ID, provider);
    setProgram(programInstance);
    return programInstance;
  };

  // Create PDAs (Program Derived Addresses)
  const deriveAddresses = async () => {
    if (!program) await initializeProgram();

    // Derive escrow account PDA
    const [escrowAccount] = await web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow")],
      PROGRAM_ID
    );

    // Derive driver account PDA
    const [driverAccount] = await web3.PublicKey.findProgramAddressSync(
      [wallet.publicKey.toBuffer(), Buffer.from("driver")],
      PROGRAM_ID
    );

    return { escrowAccount, driverAccount };
  };

  // Register Driver
  const registerDriver = async (name, licenseNumber) => {
    try {
      const connection = new web3.Connection(
        "https://rpc.testnet.soo.network/rpc"
      );
      if (!wallet || !wallet.publicKey) {
        throw new Error("Wallet is not connected.");
      }
      const data = Buffer.from(JSON.stringify({ name, licenseNumber }));
      const instruction = new web3.TransactionInstruction({
        keys: [{ pubkey: wallet.publicKey, isSigner: true, isWritable: true }],
        programId: PROGRAM_ID,
        data,
      });
      const transaction = new web3.Transaction().add(instruction);
      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");
      console.log("Transaction Signature:", signature);
    } catch (error) {
      console.log("Driver Registration error", error);
    }
  };

  // Create Ride
  const createRide = async (source, destination, fare) => {
    const program = await initializeProgram();

    // Generate a unique ride account
    const rideAccount = web3.Keypair.generate();
    try {
      const tx = await program.methods
        .createRide(
          source.map((coord) => new anchor.BN(coord)),
          destination.map((coord) => new anchor.BN(coord)),
          new anchor.BN(fare)
        )
        .accounts({
          rideAccount: rideAccount.publicKey,
          rider: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([rideAccount])
        .rpc();

      return { tx, rideAccount: rideAccount.publicKey };
    } catch (error) {
      console.error("Failed to create ride", error);
      throw error;
    }
  };

  // Accept Ride
  const acceptRide = async (tripId) => {
    const program = await initializeProgram();
    const { driverAccount } = await deriveAddresses();

    try {
      const tx = await program.methods
        .acceptRide(new anchor.BN(tripId))
        .accounts({
          rideAccount: wallet.publicKey, // Placeholder - you'll need the actual ride account
          driver: wallet.publicKey,
          driverAccount,
        })
        .rpc();

      return tx;
    } catch (error) {
      console.error("Failed to accept ride", error);
      throw error;
    }
  };

  // Complete Ride
  const completeRide = async (tripId, driverRating, riderRating) => {
    const program = await initializeProgram();
    const { escrowAccount, driverAccount } = await deriveAddresses();

    try {
      const tx = await program.methods
        .completeRide(new anchor.BN(tripId), driverRating, riderRating)
        .accounts({
          rideAccount: wallet.publicKey, // Placeholder - you'll need the actual ride account
          escrowAccount,
          driver: wallet.publicKey,
          driverAccount,
          feeRecipient: wallet.publicKey, // Platform fee recipient
        })
        .rpc();

      return tx;
    } catch (error) {
      console.error("Failed to complete ride", error);
      throw error;
    }
  };

  // Cancel Ride
  const cancelRide = async (tripId) => {
    const program = await initializeProgram();

    try {
      const tx = await program.methods
        .cancelRide(new anchor.BN(tripId))
        .accounts({
          rideAccount: wallet.publicKey, // Placeholder - you'll need the actual ride account
          rider: wallet.publicKey,
        })
        .rpc();

      return tx;
    } catch (error) {
      console.error("Failed to cancel ride", error);
      throw error;
    }
  };

  // Initialize Escrow
  const initializeEscrow = async (platformFeeRate, feeRecipient) => {
    const program = await initializeProgram();
    const { escrowAccount } = await deriveAddresses();

    try {
      const tx = await program.methods
        .initialize(platformFeeRate, feeRecipient)
        .accounts({
          escrowAccount,
          signer: wallet.publicKey,
          feeRecipient,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (error) {
      console.error("Failed to initialize escrow", error);
      throw error;
    }
  };

  return {
    registerDriver,
    createRide,
    acceptRide,
    completeRide,
    cancelRide,
    initializeEscrow,
  };
};
