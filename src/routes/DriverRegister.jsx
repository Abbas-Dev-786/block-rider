import { useState } from "react";
import { toast } from "react-toastify";
import useNew from "../hooks/useNew";

const DriverRegister = () => {
  const [name, setName] = useState("");
  const [license, setLicense] = useState("");
  const { registerDriver } = useNew();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name || !license) {
      toast.error("All fields are compulsory");
      return;
    }

    await registerDriver(name, license);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3"
        onSubmit={onSubmit}
      >
        <h3 className="text-3xl font-bold mb-4">Become A Driver</h3>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Full Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="fullname"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your Full Name"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Driving License Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="License"
            type="number"
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            placeholder="Enter your Driving License Number"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-slate-800 mx-auto hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            // disabled={isPending}
          >
            Register as a Driver
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverRegister;
