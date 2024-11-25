import { useContext, useState } from "react";
import InputItem from "./shared/InputItem";
import CarListOption from "./CarListOption";
import { SourceContext } from "../context/SourceContext";
import { DestinationContext } from "../context/DestinationContext";

function Search() {
  const { source } = useContext(SourceContext);
  const { destination } = useContext(DestinationContext);
  const [distance, setDistance] = useState(null);

  //   useEffect(() => {
  //     if (source && destination) {
  //     }
  //   }, [source, destination]);

  const calculateDistance = () => {
    const dist = window.google.maps.geometry.spherical.computeDistanceBetween(
      { lat: source.lat, lng: source.lng },
      { lat: destination.lat, lng: destination.lng }
    );
    setDistance(dist * 0.000621374);
  };
  return (
    <div>
      <div className="p-2 md:pd-6 border-[2px] rounded-xl">
        <p className="text-[20px] font-bold p-3">Get a ride</p>
        <InputItem type="source" />
        <InputItem type="destination" />
        <button
          className="p-3 bg-black w-full mt-5 text-white rounded-lg"
          onClick={() => {
            calculateDistance();
          }}
        >
          Search
        </button>
      </div>
      {distance ? <CarListOption distance={distance} /> : null}
    </div>
  );
}

export default Search;
