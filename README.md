# Ride Sharing Escrow System - Soon Blockchain

## Overview

This project implements a **Ride Sharing Escrow System** built on the **Soon Blockchain**, providing a decentralized solution for ride-sharing transactions. The platform allows for secure management of rides, driver registration, fare payments, and rating systems, all powered by smart contracts. The system ensures the protection of both riders and drivers through an escrow mechanism, platform fee management, and transaction validation.

### **Key Features:**

- **Driver Registration**: Allows drivers to register their details including name and license number.
- **Ride Creation**: Riders can create a ride, specifying source, destination, and fare.
- **Ride Acceptance**: Drivers can accept available rides and confirm the ride status.
- **Ride Completion**: After completing a ride, both drivers and riders can rate each other, and payments are processed (including platform fees).
- **Ride Cancellation**: Riders can cancel a ride under certain conditions.
  
The application uses **Soon Blockchain** to ensure transaction security and immutability.

---

## 🚀 **Technologies Used**

- **Soon Blockchain** (Testnet): For managing smart contracts and handling decentralized transactions.
- **Rust**: For writing the smart contract on Soon Blockchain.
- **JavaScript / TypeScript**: For interacting with the blockchain via a web3 interface.
- **Solana Web3.js**: For sending transactions and interacting with the blockchain.
- **Anchor Framework**: To simplify the development and testing of Solana smart contracts.
- **React**: For building the user interface.

---

## 📜 **Smart Contract Description**

The smart contract provides several functionalities, encapsulated in the `ride_sharing_escrow` program. Below are the core features implemented within the smart contract:

1. **Driver Registration (`register_driver`)**: 
   - Drivers can register by providing their name and license number.
   - Validates driver details based on length constraints for name and license number.
   - Marks the driver as registered.

2. **Ride Creation (`create_ride`)**: 
   - Riders can create a new ride by specifying source, destination, and fare.
   - Validates that the fare is positive.
   - Emits an event when a ride is successfully created.

3. **Ride Acceptance (`accept_ride`)**: 
   - Allows a registered driver to accept a ride request.
   - Validates ride status and ensures the ride isn’t expired (acceptance timeout).
   - Emits an event when a ride is accepted.

4. **Ride Completion (`complete_ride`)**: 
   - After completing a ride, both riders and drivers can rate each other.
   - Fare payment is processed, and platform fees are deducted.
   - Updates the driver’s total rides and rating.

5. **Ride Cancellation (`cancel_ride`)**: 
   - Riders can cancel the ride before it’s completed.
   - Ensures that the fare is refunded back to the rider.
   - Emits an event when a ride is canceled.

### **Error Handling**:
The contract also provides error handling for various scenarios like invalid ride state, unregistered driver, unauthorized actions, and invalid ratings.

---

## 🔧 **How to Use**

### **1. Prerequisites**
- **Node.js** (version 16 or above)
- **Solana CLI** and **Soon Blockchain Testnet** setup
- **Web3 Wallet** (Backpack Wallet) connected to the Soon Testnet
- **Rust** and **Anchor** framework installed for smart contract deployment

### **2. Set up the Project**
Clone the repository:

```bash
git clone https://github.com/your-username/ride-sharing-escrow.git
cd ride-sharing-escrow
