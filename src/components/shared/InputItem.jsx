import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { SourceContext } from "../../context/SourceContext";
import { DestinationContext } from "../../context/DestinationContext";

import sourceImg from "./../../assets/source.png";
import destImg from "./../../assets/dest.png";

function InputItem({ type }) {
  const [placeholder, setPlaceholder] = useState("null");
  const { setSource, source } = useContext(SourceContext);
  const { setdestination, destination } = useContext(DestinationContext);
  const [value, setValue] = useState(type == "source" ? source : destination);

  useEffect(() => {
    type == "source"
      ? setPlaceholder("Pickup Location")
      : setPlaceholder("Dropoff Location");
  }, [type]);

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
    <div className="bg-slate-200 p-3 rounded-lg mt-3 flex items-center gap-4">
      <img
        src={type == "source" ? sourceImg : destImg}
        width={15}
        height={15}
      />
      <GooglePlacesAutocomplete
        selectProps={{
          value,
          onChange: (place) => {
            getLatandLng(place, type);
            setValue(place);
          },
          placeholder: placeholder,
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
    </div>
  );
}

export default InputItem;

InputItem.propTypes = {
  type: PropTypes.string,
};
