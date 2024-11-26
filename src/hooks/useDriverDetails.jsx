import * as anchor from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { Buffer } from "buffer";

import IDL from "../idl/contract.idl.json";
import { CONNECTION, NETWORK } from "../constant";
// Ensure Buffer is globally available (for browser environments)
window.Buffer = Buffer;

export const useDriverDetails = () => {
  const wallet = useWallet();
  const [driverDetails, setDriverDetails] = useState(null);

  const fetchDriverDetails = async () => {
    if (!wallet.connected) {
      throw new Error("Wallet not connected");
    }

    // const connection = new web3.Connection(
    //   web3.clusterApiUrl(NETWORK),
    //   "confirmed"
    // );

    // Derive the driver account PDA
    const [driverAccountPDA] = web3.PublicKey.findProgramAddressSync(
      [wallet.publicKey.toBuffer(), Buffer.from("driver")],
      new web3.PublicKey(IDL.address)
    );

    try {
      // Create an Anchor program instance
      const provider = new anchor.AnchorProvider(CONNECTION, wallet, {
        commitment: "confirmed",
      });
      const program = new anchor.Program(IDL, IDL.address, provider);

      // Fetch the driver account
      const driverAccountData = await program.account.driverAccount.fetch(
        driverAccountPDA
      );

      // Transform the fetched data
      const details = {
        publicKey: wallet.publicKey,
        name: driverAccountData.name,
        licenseNumber: driverAccountData.licenseNumber,
        isRegistered: driverAccountData.isRegistered,
        rating: driverAccountData.rating.toNumber(),
        totalRides: driverAccountData.totalRides.toNumber(),
      };

      setDriverDetails(details);
      return details;
    } catch (error) {
      console.error("Failed to fetch driver details:", error);
      return null;
    }
  };

  // Hook to automatically fetch driver details on wallet connection
  useEffect(() => {
    if (wallet.connected) {
      fetchDriverDetails();
    }
  }, [wallet.connected]);

  return {
    driverDetails,
    fetchDriverDetails,
  };
};
