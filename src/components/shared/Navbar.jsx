import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useDriverDetails } from "../../hooks/useDriverDetails";
import useNew from "../../hooks/useNew";

const NAV_LINKS = [
  { text: "Book a Ride", link: "/book-ride", showOnConnected: false },
  { text: "My Trips", link: "/trips", showOnConnected: true },
  // {
  //   text: "Notifications",
  //   link: "/notifications",
  //   showOnConnected: true,
  // },
  { text: "Become a Driver", link: "/driver-register", showOnConnected: true },
  // { text: "Driver Trips", link: "/driver/trips" },
];

const Navbar = () => {
  const { publicKey, connected } = useWallet();

  // const { driverDetails, fetchDriverDetails } = useDriverDetails();
  const { fetchDriverDetails, driver } = useNew();

  // const { isConnected, address } = useAccount();
  const [isOpen, setOpen] = useState(false);

  // const { data: driverData } = useReadContract({
  //   abi,
  //   address: CONTRACT_ADDRESS,
  //   functionName: "drivers",
  //   args: [address],
  // });

  useEffect(() => {
    if (connected) {
      fetchDriverDetails();
    }
  }, [connected]);

  return (
    <header>
      <nav className="w-full fixed top-0  bg-[#000000] backdrop-blur-md z-50 px-5 md:px-0 py-2.5 ">
        <div className="flex flex-wrap justify-between items-center mx-auto md:px-20">
          {/* logo side */}

          <div className="flex items-center">
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center mr-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
              onClick={() => setOpen((prev) => !prev)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <NavLink to="/" className="flex items-center">
              <p className="text-2xl font-bold text-white">Block Ride</p>
            </NavLink>
          </div>

          {/* Action buttons */}
          <div className="flex items-center lg:order-2">
            <WalletMultiButton
              style={{
                background: "transparent",
                border: "1px solid white",
                padding: "2px 10px",
                borderRadius: "50px",
                fontSize: "14px",
                height: "auto",
                lineHeight: "30px",
                fontFamily: "inherit",
                outline: "none",
              }}
            />
            {/* <w3m-button label="Login / Register" size="sm" /> */}
          </div>

          {/* nav links */}
          <div
            className={`${
              isOpen ? "" : "hidden"
            } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {NAV_LINKS.filter((link) =>
                link.showOnConnected === false ? true : Boolean(publicKey)
              ).map(({ text, link }) => (
                <li key={text} onClick={() => setOpen(false)}>
                  <NavLink
                    to={link}
                    className={({ isActive }) =>
                      isActive
                        ? "capitalize block py-2 pr-4 pl-3 text-white font-bold rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                        : "capitalize block py-2 pr-4 pl-3 text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                    }
                  >
                    {text}
                  </NavLink>
                </li>
              ))}

              {driver?.[0] && (
                <li onClick={() => setOpen(false)}>
                  <NavLink
                    to={"/driver-panel"}
                    className={({ isActive }) =>
                      isActive
                        ? "capitalize block py-2 pr-4 pl-3 text-white font-bold rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                        : "capitalize block py-2 pr-4 pl-3 text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                    }
                  >
                    Driver Panel
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
