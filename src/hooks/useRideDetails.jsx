import * as anchor from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { Buffer } from "buffer";

import IDL from "../idl/contract.idl.json";
import { CONNECTION, NETWORK } from "../constant";

// Ensure Buffer is globally available (for browser environments)
window.Buffer = Buffer;

export const useRideDetails = () => {
  const wallet = useWallet();
  const [rideDetails, setRideDetails] = useState(null);

  const fetchRideDetails = async (tripId) => {
    if (!wallet.connected) {
      throw new Error("Wallet not connected");
    }

    // const connection = new web3.Connection(
    //   web3.clusterApiUrl(NETWORK),
    //   "confirmed"
    // );

    try {
      // Create an Anchor program instance
      const provider = new anchor.AnchorProvider(CONNECTION, wallet, {
        commitment: "confirmed",
      });
      const program = new anchor.Program(IDL, IDL.address, provider);

      // Find all ride accounts
      const rideAccounts = await CONNECTION.getProgramAccounts(
        new web3.PublicKey(IDL.address),
        {
          filters: [
            {
              memcmp: {
                offset: 8, // Discriminator offset
                bytes: anchor.utils.bytes.bs58.encode(
                  new anchor.BN(tripId).toArrayLike(Buffer)
                ),
              },
            },
          ],
        }
      );

      // If no ride found, return null
      if (rideAccounts.length === 0) {
        return null;
      }

      // Fetch the specific ride account data
      const rideAccountData = await program.account.rideAccount.fetch(
        rideAccounts[0].pubkey
      );

      // Transform the fetched data
      const details = {
        tripId: rideAccountData.tripId.toNumber(),
        rider: rideAccountData.rider,
        driver: rideAccountData.driver,
        fare: rideAccountData.fare.toNumber(),
        source: [
          rideAccountData.source[0].toNumber(),
          rideAccountData.source[1].toNumber(),
        ],
        destination: [
          rideAccountData.destination[0].toNumber(),
          rideAccountData.destination[1].toNumber(),
        ],
        status: Object.keys(rideAccountData.status)[0],
        createdAt: new Date(rideAccountData.createdAt.toNumber() * 1000),
        driverRating: rideAccountData.driverRating,
        riderRating: rideAccountData.riderRating,
      };

      setRideDetails(details);
      return details;
    } catch (error) {
      console.error("Failed to fetch ride details:", error);
      return null;
    }
  };

  const fetchAllUserRides = async () => {
    if (!wallet.connected) {
      throw new Error("Wallet not connected");
    }

    const connection = new web3.Connection(
      web3.clusterApiUrl(NETWORK),
      "confirmed"
    );

    try {
      // Create an Anchor program instance
      const provider = new anchor.AnchorProvider(connection, wallet, {
        commitment: "confirmed",
      });
      const program = new anchor.Program(IDL, IDL.address, provider);

      // Find all ride accounts for the current user (as either rider or driver)
      const rideAccounts = await connection.getProgramAccounts(
        new web3.PublicKey(IDL.address),
        {
          filters: [
            {
              memcmp: {
                offset: 8 + 32, // Discriminator (8) + rider publickey offset
                bytes: wallet.publicKey.toBase58(),
              },
            },
          ],
        }
      );

      // Transform ride accounts
      const rides = await Promise.all(
        rideAccounts.map(async (rideAccount) => {
          const rideAccountData = await program.account.rideAccount.fetch(
            rideAccount.pubkey
          );

          return {
            tripId: rideAccountData.tripId.toNumber(),
            rider: rideAccountData.rider,
            driver: rideAccountData.driver,
            fare: rideAccountData.fare.toNumber(),
            status: Object.keys(rideAccountData.status)[0],
            createdAt: new Date(rideAccountData.createdAt.toNumber() * 1000),
          };
        })
      );

      return rides;
    } catch (error) {
      console.error("Failed to fetch user rides:", error);
      return [];
    }
  };

  return {
    rideDetails,
    fetchRideDetails,
    fetchAllUserRides,
  };
};
