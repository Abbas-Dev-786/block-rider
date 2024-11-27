import { useContext, useEffect, useState } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import CarListItem from "./CarListItem";
import { CarListData } from "../data/data";
import driverAnimation from "./../assets/driver-animation.mp4";
import { SourceContext } from "../context/SourceContext";
import { DestinationContext } from "../context/DestinationContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useNew from "../hooks/useNew";
import { useWallet } from "@solana/wallet-adapter-react";

function CarListOption({ distance }) {
  const { connected, wallet } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState();
  const [selectedCar, setSelectedCar] = useState();
  const { source } = useContext(SourceContext);
  const { destination } = useContext(DestinationContext);

  const { createRide, isPending, isSuccess } = useNew();
  const navigate = useNavigate();

  const handleRideRequestBtnClick = () => {
    if (!connected) {
      toast.error("Please Login to book the ride");
      return;
    }

    // if (!data || data?.value === 0n) {
    //   toast.error("Insuffient funds");
    //   return;
    // }

    setIsOpen(true);

    const sourceCoords = [source.lat, source.lng];
    const destinationCoords = [destination.lat, destination.lng];

    toast.error("", {});
    // createRide(sourceCoords, destinationCoords, 0.001);
  };

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false);
      navigate("/trips");
    }

    // eslint-disable-next-line
  }, [isSuccess]);

  return (
    <div className="mt-5 overflow-auto h-[500px]">
      <h2 className="text-[22px] font-bold">Recommended</h2>
      {CarListData.map((item, index) => (
        <div
          key={index}
          className={`cursor-pointer p-2 px-4 rounded-md border-black
          ${activeIndex === index ? "border-[3px]" : ""}`}
          onClick={() => {
            setActiveIndex(index);
            setSelectedCar(item);
          }}
        >
          <CarListItem car={item} distance={distance} />
        </div>
      ))}
      {selectedCar ? (
        <div className="flex text-[14px] md:pr-0 pr-10 z-10 justify-between fixed bottom-2 bg-white rounded-lg shadow-xl w-full md:w-[30%] border-[1px] items-center">
          <p className="p-1">
            Book for <b>${(selectedCar.amount * distance).toFixed(2)}</b>
          </p>
          <button
            className="p-3 bg-black text-white rounded-lg text-center"
            onClick={handleRideRequestBtnClick}
          >
            Request {selectedCar.name}
          </button>
        </div>
      ) : null}

      <Dialog
        open={isOpen || isPending}
        onClose={() => {
          setIsOpen(false);
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center ">
          <DialogPanel className="max-w-xl space-y-2 border bg-slate-100 p-5 rounded-xl">
            <DialogTitle className="text-3xl capitalize font-bold text-center">
              Finding Driver near you
            </DialogTitle>
            <video src={driverAnimation} loop autoPlay muted>
              Your browser does not support the video tag.
            </video>
            <Description className={"text-center"}>
              <p>
                Please wait while we find the best driver for your ride. This
                may take a moment.
              </p>
              <p>Thank you for your patience!</p>
              <p className="bg-red-300 p-2 mt-3">
                <strong>Important:</strong> Please do not close this window,
                refresh the page, or navigate away while we complete the search.
              </p>
            </Description>
            {/* <div className="flex gap-4">
              <button onClick={() => setIsOpen(false)}></button>
            </div> */}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

export default CarListOption;
