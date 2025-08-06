import React from "react";

function WhatsappChannel() {
  return (
    <div className="h-screen bg-purple-50 flex items-center justify-center">
      <div className="bg-[#9600ff] px-4 py-20 rounded-3xl shadow-lg  w-[65%]">
       <div className="grid grid-cols-1 md:grid-cols-[40%_auto] items-center gap-6 mb-6">
  <div className="flex justify-end">
    <img
      src="../../assets/whatsapp.webp"
      alt="ZenStudy Logo"
      className="max-w-lg object-contain h-72 rounded-full"
    />
  </div>
  <div className="text-start text-white space-y-4">
    <p className="text-4xl md:text-5xl font-bold">Join Our</p>
    <p className="text-5xl md:text-7xl font-bold">WhatsApp</p>
    <p className="text-5xl md:text-7xl font-bold">Channel</p>
  </div>
</div>

        <div className="flex items-center justify-center">
          <button className="animate-glow-gold bgGredient-gold w-[50%] textDark px-6 py-4 rounded-lg hover:bg-green-600 transition duration-300">
            <a
              href="https://zenstudy.in/whatsapp-link"
              target="_blank"
              rel="noopener noreferrer"
              className="text-4xl font-semibold"
            >
              Join Now
            </a>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WhatsappChannel;
