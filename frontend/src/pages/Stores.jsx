import { useState } from "react";

const Stores = () => {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [gst, setGst] = useState("");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Seller Registration</h2>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Enter Mobile Number</label>
            <div className="flex">
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter Mobile Number"
              />
              <button className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition">
                Send OTP
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email ID</label>
            <input
              type="email"
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Enter GSTIN</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              placeholder="Enter GSTIN"
            />
            <p className="text-xs text-gray-500 mt-1">
              GSTIN is required to sell products. You can also share it in the final step.
            </p>
          </div>
        </div>

        {/* Terms & Register Button */}
        <div className="mt-4 text-center text-sm text-gray-500">
          By continuing, I agree to the <a href="#" className="text-blue-500 underline">Terms of Use & Privacy Policy</a>.
        </div>

        <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          Register & Continue
        </button>
      </div>
    </div>
  );
};



export default Stores
