// // Example of incoming streams webhook payload
// const exampleStreamPayload = {
//   block: {
//     hash: "0x123...",
//     number: "0x1234",
//     timestamp: "0x60c4b3f0",
//   },
//   logs: [
//     {
//       address: "0xRideContractAddress",
//       topics: [
//         "0xRideRequestCreated(uint256,address,string,string,uint256)", // event signature hash
//         "0x000000000000000000000000000000000000000000000000000000000000002a", // rideId
//         "0x000000000000000000000000123456789abcdef123456789abcdef123456789a", // rider address
//       ],
//       data: "0x...", // ABI encoded data
//       blockHash: "0x123...",
//       blockNumber: "0x1234",
//       transactionHash: "0x456...",
//       transactionIndex: "0x1",
//       logIndex: "0x0",
//     },
//   ],
// };

// // streams-processor.js
// import { ethers } from "ethers";
// import { RideContract } from "./contracts/RideContract";

// class StreamsProcessor {
//   constructor() {
//     // Initialize contract ABI interface
//     this.contractInterface = new ethers.utils.Interface(RideContract.abi);
//   }

//   async processWebhook(payload) {
//     const { block, logs } = payload;

//     // Process each log in the payload
//     for (const log of logs) {
//       try {
//         // Decode the log based on event signature
//         const decodedLog = this.decodeLog(log);

//         // Process the decoded data
//         await this.handleDecodedEvent(decodedLog, block);
//       } catch (error) {
//         console.error("Error processing log:", error);
//         // Store failed logs for retry
//         await this.storeFailedLog(log, error);
//       }
//     }
//   }

//   decodeLog(log) {
//     try {
//       // Parse the event signature from topics[0]
//       const eventSignature = log.topics[0];

//       // Decode the entire log using contract interface
//       const decodedLog = this.contractInterface.parseLog({
//         topics: log.topics,
//         data: log.data,
//       });

//       // Extract timestamp from block
//       const timestamp = parseInt(log.block.timestamp, 16);

//       return {
//         name: decodedLog.name,
//         signature: eventSignature,
//         args: decodedLog.args,
//         block: {
//           hash: log.blockHash,
//           number: parseInt(log.blockNumber, 16),
//           timestamp,
//         },
//         transaction: {
//           hash: log.transactionHash,
//           index: parseInt(log.transactionIndex, 16),
//         },
//       };
//     } catch (error) {
//       console.error("Error decoding log:", error);
//       throw error;
//     }
//   }

//   async handleDecodedEvent(decodedLog, block) {
//     // Extract event details
//     const { name, args, block: blockInfo, transaction } = decodedLog;

//     // Handle different event types
//     switch (name) {
//       case "RideRequestCreated": {
//         const eventData = {
//           rideId: args.rideId.toString(),
//           rider: args.rider,
//           pickupLocation: args.pickupLocation,
//           destination: args.destination,
//           fare: ethers.utils.formatEther(args.fare),
//           timestamp: blockInfo.timestamp,
//           blockNumber: blockInfo.number,
//           transactionHash: transaction.hash,
//         };
//         await this.handleRideRequest(eventData);
//         break;
//       }

//       case "RideAccepted": {
//         const eventData = {
//           rideId: args.rideId.toString(),
//           driver: args.driver,
//           timestamp: blockInfo.timestamp,
//           blockNumber: blockInfo.number,
//           transactionHash: transaction.hash,
//         };
//         await this.handleRideAcceptance(eventData);
//         break;
//       }

//       case "RideStarted": {
//         const eventData = {
//           rideId: args.rideId.toString(),
//           timestamp: blockInfo.timestamp,
//           blockNumber: blockInfo.number,
//           transactionHash: transaction.hash,
//         };
//         await this.handleRideStart(eventData);
//         break;
//       }

//       case "RideCompleted": {
//         const eventData = {
//           rideId: args.rideId.toString(),
//           timestamp: blockInfo.timestamp,
//           blockNumber: blockInfo.number,
//           transactionHash: transaction.hash,
//         };
//         await this.handleRideCompletion(eventData);
//         break;
//       }

//       case "PaymentProcessed": {
//         const eventData = {
//           rideId: args.rideId.toString(),
//           amount: ethers.utils.formatEther(args.amount),
//           timestamp: blockInfo.timestamp,
//           blockNumber: blockInfo.number,
//           transactionHash: transaction.hash,
//         };
//         await this.handlePaymentProcessed(eventData);
//         break;
//       }

//       default:
//         console.warn(`Unhandled event type: ${name}`);
//     }
//   }

//   async handleRideRequest(eventData) {
//     try {
//       // 1. Store ride request in database
//       await db.rides.create({
//         data: {
//           rideId: eventData.rideId,
//           rider: eventData.rider,
//           pickupLocation: eventData.pickupLocation,
//           destination: eventData.destination,
//           fare: eventData.fare,
//           status: "REQUESTED",
//           createdAt: new Date(eventData.timestamp * 1000),
//           blockNumber: eventData.blockNumber,
//           transactionHash: eventData.transactionHash,
//         },
//       });

//       // 2. Call QuickNode function for ride matching
//       await quicknode.functions.call("matchRide", {
//         rideId: eventData.rideId,
//         rider: eventData.rider,
//         pickupLocation: eventData.pickupLocation,
//         destination: eventData.destination,
//         fare: eventData.fare,
//       });
//     } catch (error) {
//       console.error("Error handling ride request:", error);
//       throw error;
//     }
//   }

//   async storeFailedLog(log, error) {
//     await db.failedLogs.create({
//       data: {
//         log: JSON.stringify(log),
//         error: error.message,
//         timestamp: new Date(),
//         status: "PENDING_RETRY",
//       },
//     });
//   }

//   // Implement retry mechanism for failed logs
//   async retryFailedLogs() {
//     const failedLogs = await db.failedLogs.findMany({
//       where: {
//         status: "PENDING_RETRY",
//         retryCount: {
//           lt: 3, // Maximum retry attempts
//         },
//       },
//     });

//     for (const failedLog of failedLogs) {
//       try {
//         const log = JSON.parse(failedLog.log);
//         await this.processWebhook({ logs: [log] });

//         // Update status if successful
//         await db.failedLogs.update({
//           where: { id: failedLog.id },
//           data: { status: "PROCESSED" },
//         });
//       } catch (error) {
//         // Update retry count
//         await db.failedLogs.update({
//           where: { id: failedLog.id },
//           data: {
//             retryCount: failedLog.retryCount + 1,
//             lastError: error.message,
//           },
//         });
//       }
//     }
//   }
// }

// // webhook-handler.js
// export async function handleWebhook(req, res) {
//   const processor = new StreamsProcessor();

//   try {
//     await processor.processWebhook(req.body);
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Webhook processing error:", error);
//     res.status(500).json({ error: error.message });
//   }
// }

// /*
// function main(stream) {
//   // If stream is configured with metadata in the body, the data may be nested under "data" key
//   const data = stream.data ? stream.data : stream;

//   // my contract address
//   const CONTRACT_ADDRESS = "0x5825d8aeb7a46b9de858df8aae7a7898da97b61e";

//   const transactions = data?.[0]?.block?.transactions;
//   const receipts = data?.[0]?.receipts;

//   // Filter transactions related to our contract
//     const relevantTransactions = transactions.filter(tx =>
//         tx.to?.toLowerCase() === CONTRACT_ADDRESS ||
//         tx.from?.toLowerCase() === CONTRACT_ADDRESS
//     );

//     // Filter logs from our contract
//     const relevantLogs = receipts.flatMap(receipt =>
//         receipt.logs.filter(log =>
//             log.address.toLowerCase() === CONTRACT_ADDRESS
//         )
//     );

//     return {
//         transactions: relevantTransactions,
//         logs: relevantLogs
//     };
// }
// */

// /*
// import ethers from "ethers"

// const myABI = JSON.stringify([
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "_rideId",
//         type: "uint256",
//       },
//     ],
//     name: "acceptRide",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "_rideId",
//         type: "uint256",
//       },
//     ],
//     name: "cancelRide",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "_rideId",
//         type: "uint256",
//       },
//     ],
//     name: "completeRide",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "int256[]",
//         name: "_source",
//         type: "int256[]",
//       },
//       {
//         internalType: "int256[]",
//         name: "_destination",
//         type: "int256[]",
//       },
//     ],
//     name: "createRide",
//     outputs: [],
//     stateMutability: "payable",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "initialFeeRate",
//         type: "uint256",
//       },
//       {
//         internalType: "address payable",
//         name: "initialFeeRecipient",
//         type: "address",
//       },
//     ],
//     stateMutability: "nonpayable",
//     type: "constructor",
//   },
//   {
//     inputs: [],
//     name: "EmptyCoordinates",
//     type: "error",
//   },
//   {
//     inputs: [],
//     name: "InvalidFare",
//     type: "error",
//   },
//   {
//     inputs: [
//       {
//         internalType: "int256",
//         name: "latitude",
//         type: "int256",
//       },
//     ],
//     name: "InvalidLatitude",
//     type: "error",
//   },
//   {
//     inputs: [
//       {
//         internalType: "int256",
//         name: "longitude",
//         type: "int256",
//       },
//     ],
//     name: "InvalidLongitude",
//     type: "error",
//   },
//   {
//     inputs: [],
//     name: "InvalidRideState",
//     type: "error",
//   },
//   {
//     inputs: [],
//     name: "LengthShouldBeTwoCoordinates",
//     type: "error",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "owner",
//         type: "address",
//       },
//     ],
//     name: "OwnableInvalidOwner",
//     type: "error",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "account",
//         type: "address",
//       },
//     ],
//     name: "OwnableUnauthorizedAccount",
//     type: "error",
//   },
//   {
//     inputs: [
//       {
//         internalType: "string",
//         name: "_name",
//         type: "string",
//       },
//       {
//         internalType: "uint256",
//         name: "_licenseNumber",
//         type: "uint256",
//       },
//     ],
//     name: "registerDriver",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "renounceOwnership",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "RideExpired",
//     type: "error",
//   },
//   {
//     inputs: [],
//     name: "TransferFailed",
//     type: "error",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "newOwner",
//         type: "address",
//       },
//     ],
//     name: "transferOwnership",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "UnauthorizedAction",
//     type: "error",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "address",
//         name: "newFeeRecipient",
//         type: "address",
//       },
//     ],
//     name: "FeeRecipientUpdated",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "previousOwner",
//         type: "address",
//       },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "newOwner",
//         type: "address",
//       },
//     ],
//     name: "OwnershipTransferred",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "newFeeRate",
//         type: "uint256",
//       },
//     ],
//     name: "PlatformFeeUpdated",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "uint256",
//         name: "rideId",
//         type: "uint256",
//       },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "driver",
//         type: "address",
//       },
//     ],
//     name: "RideAccepted",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "uint256",
//         name: "rideId",
//         type: "uint256",
//       },
//     ],
//     name: "RideCancelled",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "uint256",
//         name: "rideId",
//         type: "uint256",
//       },
//     ],
//     name: "RideCompleted",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "uint256",
//         name: "rideId",
//         type: "uint256",
//       },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "rider",
//         type: "address",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "fare",
//         type: "uint256",
//       },
//     ],
//     name: "RideCreated",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "uint256",
//         name: "transactionId",
//         type: "uint256",
//       },
//       {
//         indexed: true,
//         internalType: "uint256",
//         name: "tripId",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount",
//         type: "uint256",
//       },
//     ],
//     name: "TransactionRecorded",
//     type: "event",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address payable",
//         name: "_newFeeRecipient",
//         type: "address",
//       },
//     ],
//     name: "updateFeeRecipient",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "_newFeeRate",
//         type: "uint256",
//       },
//     ],
//     name: "updatePlatformFee",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "",
//         type: "address",
//       },
//     ],
//     name: "drivers",
//     outputs: [
//       {
//         internalType: "string",
//         name: "name",
//         type: "string",
//       },
//       {
//         internalType: "uint256",
//         name: "licenseNumber",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "feeRecipient",
//     outputs: [
//       {
//         internalType: "address payable",
//         name: "",
//         type: "address",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "getMyTrips",
//     outputs: [
//       {
//         components: [
//           {
//             internalType: "uint256",
//             name: "tripId",
//             type: "uint256",
//           },
//           {
//             internalType: "uint256",
//             name: "transactionId",
//             type: "uint256",
//           },
//           {
//             internalType: "int256[]",
//             name: "source",
//             type: "int256[]",
//           },
//           {
//             internalType: "int256[]",
//             name: "destination",
//             type: "int256[]",
//           },
//           {
//             internalType: "address payable",
//             name: "rider",
//             type: "address",
//           },
//           {
//             internalType: "address payable",
//             name: "driver",
//             type: "address",
//           },
//           {
//             internalType: "uint256",
//             name: "fare",
//             type: "uint256",
//           },
//           {
//             internalType: "enum RideSharingEscrow.RideStatus",
//             name: "status",
//             type: "uint8",
//           },
//           {
//             internalType: "uint256",
//             name: "createdAt",
//             type: "uint256",
//           },
//         ],
//         internalType: "struct RideSharingEscrow.Ride[]",
//         name: "",
//         type: "tuple[]",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "_rideId",
//         type: "uint256",
//       },
//     ],
//     name: "getRideStatus",
//     outputs: [
//       {
//         internalType: "enum RideSharingEscrow.RideStatus",
//         name: "",
//         type: "uint8",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "owner",
//     outputs: [
//       {
//         internalType: "address",
//         name: "",
//         type: "address",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "platformFeeRate",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "RIDE_ACCEPTANCE_TIMEOUT",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "transactionCounter",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
// ]);

// class StreamsProcessor {
//   constructor() {
//     // Initialize contract ABI interface
//     this.contractInterface = new ethers.utils.Interface(myABI);
//   }
// }

// */
