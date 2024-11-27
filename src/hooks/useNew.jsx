import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import idl from "../idl/contract.idl.json"; // Import your IDL file
import {
  useConnection,
  useWallet as useSolanaWallet,
} from "@solana/wallet-adapter-react";
import { PROGRAM_ID } from "../constant";
import { toast } from "react-toastify";

const useNew = () => {
  const { connection } = useConnection();
  const wallet = useSolanaWallet();

  const registerDriver = async (driverName, licenseNumber) => {
    try {
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
    }
  };

  return { registerDriver };
};

export default useNew;
