import { LoadScript } from "@react-google-maps/api";
import Maps from "../components/shared/Maps";
import Search from "../components/Search";

const RideBookingPage = () => {
  return (
    <LoadScript
      libraries={["places"]}
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
    >
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-5 pt-24">
        <div>
          <Search />
        </div>
        <div className="col-span-2 border mt-6 md:mt-0">
          <Maps />
        </div>
      </div>
    </LoadScript>
  );
};

export default RideBookingPage;
