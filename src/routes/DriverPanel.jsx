import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import useNew from "../hooks/useNew";

// Example ride notifications
const notifications = [
  { id: 1, details: "Ride request from Alice for 5 PM" },
  { id: 2, details: "Ride request from Bob for 6 PM" },
];

const DriverPanel = () => {
  const { connected } = useWallet();
  const { driver: driverData, fetchDriverDetails } = useNew();

  const handleRejectBtnClick = (id) => {
    const ride = JSON.parse(localStorage.getItem("rejected-rides"));
    // ride.push(rideId);
    localStorage.setItem("rejected-rides", JSON.stringify(ride));

    // writeContract({
    //   abi,
    //   address: CONTRACT_ADDRESS,
    //   functionName: "cancelRide",
    //   args: [id],
    // });
  };

  const handleAcceptBtnClick = (id) => {
    console.log("hello");
    // writeContract({
    //   abi,
    //   address: CONTRACT_ADDRESS,
    //   functionName: "acceptRide",
    //   args: [id],
    // });
  };

  const handleCompleteBtnClick = (id) => {
    // writeContract({
    //   abi,
    //   address: CONTRACT_ADDRESS,
    //   functionName: "completetRide",
    //   args: [id],
    // });
  };

  useEffect(() => {
    if (connected) {
      fetchDriverDetails();
    }
  }, [connected]);

  if (!connected) {
    toast.error("You are not login");
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Driver Info Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-4 w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-2">Driver Details</h2>
        <p className="text-gray-700">Name: {driverData?.[0]?.account?.name}</p>
        <p className="text-gray-700">
          License Number: {driverData?.[0]?.account?.licenseNumber}
        </p>
      </div>

      {/* Ride Notifications Section */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Ride Notifications</h2>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex justify-between items-center mb-4"
          >
            <span className="text-gray-800">{notification.details}</span>
            <div className="flex flex-col md:flex-row items-start justify-end md:justify-between flex-wrap gap-4">
              {/* {RIDE_STATUS[rideStatus] === RIDE_STATUS[0] && (
                <>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleAcceptBtnClick(i)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleRejectBtnClick(i)}
                  >
                    Reject
                  </button>
                </>
              )}

              {RIDE_STATUS[rideStatus] === RIDE_STATUS[1] && (
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  onClick={() => handleCompleteBtnClick(i)}
                >
                  Complete Ride
                </button>
              )}

              {RIDE_STATUS[rideStatus] === RIDE_STATUS[3] && (
                <p>Ride is Already completed</p>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverPanel;
