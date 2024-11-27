import { Route, Routes } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import HomePage from "./routes/HomePage";
import Footer from "./components/shared/Footer";
import RideBookingPage from "./routes/RideBooking";
import { useState } from "react";
import { SourceContext } from "./context/SourceContext";
import { DestinationContext } from "./context/DestinationContext";
import DriverRegister from "./routes/DriverRegister";
import Notification from "./components/shared/Notification";
import Trips from "./routes/Trips";
import DriverPanel from "./routes/DriverPanel";

const App = () => {
  const [source, setSource] = useState([]);
  const [destination, setdestination] = useState([]);

  return (
    <SourceContext.Provider value={{ source, setSource }}>
      <DestinationContext.Provider value={{ destination, setdestination }}>
        <Navbar />
        <Notification />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book-ride" element={<RideBookingPage />} />{" "}
          <Route path="/driver-register" element={<DriverRegister />} />{" "}
          <Route path="/driver-panel" element={<DriverPanel />} />{" "}
          <Route path="/trips" element={<Trips />} />{" "}
          {/* <Route path="/driver/trips" element={<DriverTrips />} /> */}
        </Routes>

        <Footer />
      </DestinationContext.Provider>
    </SourceContext.Provider>
  );
};

export default App;
