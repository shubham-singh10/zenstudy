import { useState } from "react";

const Testing = () => {
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div className="min-h-screen bgGradient-purple-light flex items-center justify-center px-4">
    
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-5xl  border-[#543a5d] border-2">
        <div className="text-center mb-6">
          <span className="text-2xl font-semibold textGreen">Paying to</span>
          <span className="text-3xl font-bold textPurple"> Zenstudy</span>
        </div>
        <div className=" flex flex-col md:flex-row rounded-xl overflow-hidden ">
          {/* Left: Webinar Image */}
          <div className="md:w-1/2 p-4 bg-white">
            <img
              src="../assets/webinar20jul.png" // replace with actual image path
              alt="UPSC Webinar"
              className="w-full h-full object-contain rounded-xl  "
            />
          </div>

          {/* Right: Payment Form */}
          <div className="md:w-1/2 p-6 flex flex-col justify-center space-y-4 bg-white">
            <div className="text-lg font-semibold text-black mt-4">
              Payment Details
            </div>
            <div className="bg-gray-100 rounded-lg p-2 font-semibold text-lg text-black">
              ₹ 8999
            </div>
            <p className="text-xs text-gray-500">
              (18% GST already included which is paid to the Government)
            </p>

            {/* Form */}
            <input
              type="text"
              placeholder="Name"
              className="border p-2 rounded-md w-full text-sm"
            />
            <div className="flex space-x-2">
              <select className="border p-2 rounded-md text-sm">
                <option value="+91">+91</option>
                {/* add more country codes if needed */}
              </select>
              <input
                type="text"
                placeholder="Phone Number"
                className="border p-2 rounded-md flex-1 text-sm"
              />
            </div>
            <button
            className="bgGredient-green text-white py-2 rounded-md text-sm font-semibold"
            onClick={() => setOtpSent(true)}
          >
            SEND OTP
          </button>

          {/* Smooth OTP & Pay button */}
          <div
            className={`grid transition-all duration-500 ease-in-out overflow-hidden ${
              otpSent ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
          >
            <input
              type="text"
              placeholder="Enter OTP"
              className="border p-2 rounded-md w-full text-sm mb-3"
            />
            <button className="bgGredient-purple hover:scale-105 py-2 rounded-md text-sm font-semibold text-white transition-transform duration-300">
              Pay Securely ₹8999.00
            </button>
          </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testing;
