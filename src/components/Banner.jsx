import { LoadScript } from "@react-google-maps/api";
import First from "./../assets/first.webp";
import { useContext, useState } from "react";
import { SourceContext } from "../context/SourceContext";
import { DestinationContext } from "../context/DestinationContext";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Link } from "react-router-dom";

const Banner = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const { setSource } = useContext(SourceContext);
  const { setdestination } = useContext(DestinationContext);

  const getLatandLng = (place, type) => {
    const placeId = place.value.place_id;
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.getDetails({ placeId }, (result, status) => {
      if (status === "OK" && result.geometry && result.geometry.location) {
        if (type == "source") {
          setSource({
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
            name: result.formatted_address,
            label: result.name,
          });
        } else {
          setdestination({
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
            name: result.formatted_address,
            label: result.name,
          });
        }
        // const lat = result.geometry.location.lat();
        // const lng = result.geometry.location.lng();
      }
    });
  };

  return (
    <LoadScript
      libraries={["places"]}
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
    >
      <div className="w-full h-[680px] flex items-center justify-center bg-black ">
        <div className="container-lg flex items-center justify-between  px-5 h-[555px]">
          <div className="container h-[383px]">
            {/* Left side */}
            <div className="h-[191px]">
              {" "}
              {/* Upper part aka 1st half */}
              <div className="h-[191px] flex text-center md:text-left flex-col justify-between">
                <h1 className="text-[52px] font-bold leading-tight text-white">
                  Go anywhere with Block Ride
                </h1>
                <p className="content-end mb-2 text-[16px] text-white font-normal">
                  Request a ride, hop in, and go.
                </p>
              </div>
            </div>
            <div className="h-[191px] mt-2">
              {" "}
              {/* Down Part aka 2nd half */}
              <div className="md:w-[396px] h-[47px] bg-white rounded-lg flex items-center">
                {" "}
                {/* Enter location : hold 3 elems -> 1svg , 1i/p , 1svg */}
                <div className="ml-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    data-baseweb="icon"
                  >
                    <title>search</title>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm5-2a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <div className="ml-2 w-full">
                  <GooglePlacesAutocomplete
                    selectProps={{
                      start,
                      onChange: (place) => {
                        getLatandLng(place, "source");
                        setStart(place);
                      },
                      placeholder: "Enter location",
                      isClearable: true,
                      className: "w-full outline-none",
                      components: {
                        DropdownIndicator: false,
                      },
                      styles: {
                        control: (provided) => ({
                          ...provided,
                          backgroundColor: "#00fff00",
                          border: "none",
                        }),
                      },
                    }}
                  />
                  {/* <input
                  className="w-full text-[17px] text-placehol placeholder:text-placehol"
                  type="text"
                  placeholder="Enter location"
                /> */}
                </div>
                <div className="ml-auto mr-3">
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                    role="button"
                  >
                    <title>Navigate right up</title>
                    <path
                      d="M10.5 13.5.5 11 21 3l-8 20.5-2.5-10Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="absolute bg-white h-[20px] w-[1px] ml-5 " />
              {/*2nd input */}
              <div className="md:w-[396px] h-[47px] mt-[12px] bg-white rounded-lg flex items-center">
                {" "}
                {/* Enter destination : hold 2 elems -> 1svg , 1 i/p*/}
                <div className="ml-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    data-baseweb="icon"
                  >
                    <title>search</title>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14 10h-4v4h4v-4ZM7 7v10h10V7H7Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <div className="ml-2 w-full">
                  <GooglePlacesAutocomplete
                    selectProps={{
                      end,
                      onChange: (place) => {
                        getLatandLng(place, "destination");
                        setEnd(place);
                      },
                      placeholder: "Enter destination",
                      isClearable: true,
                      className: "w-full outline-none",
                      components: {
                        DropdownIndicator: false,
                      },
                      styles: {
                        control: (provided) => ({
                          ...provided,
                          backgroundColor: "#00fff00",
                          border: "none",
                        }),
                      },
                    }}
                  />
                  {/* <input
                    className="w-full text-[17px] placeholder:text-placehol"
                    type="text"
                    placeholder="Enter destination"
                  /> */}
                </div>
              </div>
              {/*Button ( Link! <a />)- see prices */}
              <div className="w-[127px] h-[48px] mt-[25px] rounded-lg bg-white flex justify-center">
                <Link
                  to="/book-ride"
                  className="text-black  text-[16px] font-medium content-center"
                >
                  See prices
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side : Image */}
          <div className="hidden md:block">
            <img src={First} width={552} height={552} alt="First picture" />
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default Banner;
