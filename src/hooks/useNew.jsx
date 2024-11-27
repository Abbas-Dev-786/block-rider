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
  const [driver, setDriver] = useState([]);

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
      const tx = await program.rpc.registerDriver(driverName, licenseNumber, {
        accounts: {
          driverAccount: driverAccount.publicKey,
          driver: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
        signers: [driverAccount],
      });

      toast(
        <p className="text-black">
          Driver Registered Successfully <br />
          <a
            target="_blank"
            href={`https://explorer.testnet.soo.network/tx/${tx}`}
            className="text-blue-600"
          >
            View on Block Explorer{" "}
          </a>
        </p>,
        { closeOnClick: false }
      );
      // toast.success("Driver Registered Successfully");

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

      toast(
        <p className="text-black">
          Ride Created Successfully <br />
          <a
            target="_blank"
            href={`https://explorer.testnet.soo.network/tx/${signature}`}
            className="text-blue-600"
          >
            View on Block Explorer{" "}
          </a>
        </p>,
        { closeOnClick: false }
      );

      // toast.success("Ride Created Successfully");
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

      const rideAccounts = await program.account.rideAccount.all([filter]);
      console.log(rideAccounts);

      setRides(rideAccounts);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  const fetchDriverDetails = async () => {
    try {
      const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );

      const program = new Program(idl, PROGRAM_ID, provider);

      const filter = {
        memcmp: {
          offset: 8, // Offset to the driver field
          bytes: wallet.publicKey.toBase58(),
        },
      };

      const driverAccounts = await program.account.driverAccount.all([filter]);
      console.log("Fetched driver details:", driverAccounts);
      setDriver(driverAccounts);
    } catch (error) {
      console.error("Error fetching driver details:", error);
    }
  };

  const acceptRide = async (rideId) => {
    try {
      setIsPending(true);
      const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );

      const program = new Program(idl, PROGRAM_ID, provider);

      const rideAccount = await program.account.rideAccount.fetch(
        new web3.PublicKey(rideId)
      );
      await program.rpc.acceptRide(new BN(rideAccount.tripId), {
        accounts: {
          rideAccount: rideAccount.publicKey,
          driver: provider.wallet.publicKey,
          driverAccount: rideAccount.driver,
        },
      });

      console.log("Ride accepted successfully");
    } catch (error) {
      console.error("Error accepting ride:", error);
    } finally {
      setIsPending(false);
    }
  };

  const cancelRide = async (rideId) => {
    try {
      setIsPending(true);
      const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );

      const program = new Program(idl, PROGRAM_ID, provider);

      const rideAccount = await program.account.rideAccount.fetch(
        new web3.PublicKey(rideId)
      );
      await program.rpc.cancelRide(new BN(rideAccount.tripId), {
        accounts: {
          rideAccount: rideAccount.publicKey,
          driver: provider.wallet.publicKey,
          driverAccount: rideAccount.driver,
        },
      });

      console.log("Ride accepted successfully");
    } catch (error) {
      console.error("Error accepting ride:", error);
    } finally {
      setIsPending(false);
    }
  };

  return {
    registerDriver,
    createRide,
    isPending,
    isSuccess,
    rides,
    fetchRides,
    fetchDriverDetails,
    driver,
    acceptRide,
    cancelRide,
  };
};

export default useNew;
