import React, { useEffect, useState } from "react";
import api from "../util/api";

const Donation = () => {
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllNgos = async () => {
      try {
        const response = await api.get("/api/users/allngo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.ngos || [];
        setNgos(data);
      } catch (error) {
        console.error("Error fetching NGOs:", error);
      }
    };

    fetchAllNgos();
  }, [token]);

  const handleDonateClick = (ngo) => {
    setSelectedNgo(ngo);
    setShowModal(true);
  };

  const handleDonationSubmit = () => {
    console.log(`Donated ₹${donationAmount} to ${selectedNgo.name}`);
    // You can integrate donation API logic here
    setDonationAmount("");
    setSelectedNgo(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-emerald-400 drop-shadow">
          Explore NGOs You Can Support 💚
        </h1>
        <p className="text-gray-300 mt-4 max-w-xl mx-auto">
          These organizations are actively helping redistribute excess goods and
          reduce waste. You can help too!
        </p>
      </div>

      {ngos.length === 0 ? (
        <p className="text-center text-gray-400">No NGOs available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {ngos.map((ngo) => (
            <div
              key={ngo._id}
              onClick={() => handleDonateClick(ngo)}
              className="cursor-pointer bg-white/5 border border-emerald-500/20 rounded-xl p-6 shadow-lg hover:shadow-emerald-400/30 transition"
            >
              <h2 className="text-xl font-semibold text-emerald-300 mb-2">
                {ngo.name}
              </h2>
              <p className="text-sm text-gray-300 mb-1">
                <strong>Email:</strong> {ngo.email}
              </p>
              <p className="text-sm text-gray-300">
                <strong>Location:</strong> {ngo.location || "Not specified"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Donation Modal */}
      {showModal && selectedNgo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1f2937] p-8 rounded-2xl shadow-xl w-[90%] max-w-md">
            <h2 className="text-2xl font-bold text-emerald-400 mb-4 text-center">
              Donate to {selectedNgo.name}
            </h2>
            <input
              type="number"
              placeholder="Enter amount (₹)"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-emerald-500 placeholder-gray-400 mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setDonationAmount("");
                  setSelectedNgo(null);
                }}
                className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDonationSubmit}
                className="px-5 py-2 rounded-md bg-emerald-500 text-black font-semibold hover:bg-emerald-600"
              >
                Donate ₹{donationAmount || "0"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donation;
