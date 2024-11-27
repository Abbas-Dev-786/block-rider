import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import idl from "../idl/contract.idl.json"; // Import your IDL file
import {
  useConnection,
  useWallet as useSolanaWallet,
} from "@solana/wallet-adapter-react";
import { PROGRAM_ID } from "../constant";
import { toast } from "react-toastify";
import { useState } from "react";

const useNew = () => {
  const { connection } = useConnection();
  const wallet = useSolanaWallet();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rides, setRides] = useState([]);

  const registerDriver = async (driverName, licenseNumber) => {
    try {
      setIsPending(true);
      const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );

      const program = new Program(idl, PROGRAM_ID, provider);

      const driverAccount = web3.Keypair.generate();
      await program.rpc.registerDriver(driverName, licenseNumber, {
        accounts: {
          driverAccount: driverAccount.publicKey,
          driver: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
        signers: [driverAccount],
      });

      toast.success("Driver Registered Successfully");

      console.log("Driver registered successfully");
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
      console.error("Error registering driver:", error);
    } finally {
      setIsPending(false);
    }
  };

  const createRide = async (source, destination, fare) => {
    try {
      setIsPending(true);
      setIsSuccess(false);
      const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );

      const program = new Program(idl, PROGRAM_ID, provider);

      const rideAccount = web3.Keypair.generate();

      const fareInLamports = new BN(fare * 1_000_000_000);
      const signature = await program.rpc.createRide(
        [new BN(source[0]), new BN(source[1])],
        [new BN(destination[0]), new BN(destination[1])],
        fareInLamports,
        {
          accounts: {
            rideAccount: rideAccount.publicKey,
            rider: provider.wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
          },
          signers: [rideAccount],
        }
      );

      console.log(signature);

      toast.success("Ride Created Successfully");
      setIsSuccess(true);
      console.log("Ride created successfully");
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
      console.error("Error creating ride:", error);
    } finally {
      setIsPending(false);
    }
  };

  const fetchRides = async () => {
    try {
      const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );

      const program = new Program(idl, PROGRAM_ID, provider);
      const filter = {
        memcmp: {
          offset: 8 + 32, // Offset to the rider field
          bytes: wallet.publicKey.toBase58(),
        },
      };

      const ridesAccounts = await program.account.rideAccount.all([filter]);

      setRides(ridesAccounts);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  return {
    registerDriver,
    createRide,
    isPending,
    isSuccess,
    rides,
    fetchRides,
  };
};

export default useNew;
