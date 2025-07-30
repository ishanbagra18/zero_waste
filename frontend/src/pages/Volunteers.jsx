import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await axios.get('https://zero-waste-2xxf.onrender.com/api/users/allvolunteer');
        setVolunteers(res.data.Volunteer || []);
      } catch (err) {
        console.error("Failed to fetch volunteers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-blue-500 drop-shadow-lg">
          Our Passionate Volunteers
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <ClipLoader color="#36d7b7" loading={loading} size={50} />
          </div>
        ) : volunteers.length === 0 ? (
          <p className="text-center text-gray-400">No volunteers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {volunteers.map((volunteer) => (
              <div
                key={volunteer._id}
                className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 border border-gray-700 rounded-2xl shadow-2xl p-7 transition-transform hover:scale-105 hover:shadow-blue-800/50 group relative overflow-hidden"
              >
                <div className="flex justify-center">
                  <img
                    src={volunteer.photo?.url}
                    alt={volunteer.name}
                    className="w-28 h-28 object-cover rounded-full border-4 border-indigo-500 shadow-xl ring-2 ring-cyan-300 group-hover:ring-indigo-400 transition-all duration-300"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-center mt-4 mb-1 text-indigo-400">{volunteer.name}</h3>
                <div className="flex justify-center">
                  <span className="inline-block px-3 py-1 text-xs font-bold bg-cyan-700 bg-opacity-20 text-cyan-300 rounded-full border border-cyan-400 shadow-sm mb-4 uppercase tracking-wide">
                    {volunteer.role}
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-100 space-y-1">
                  <p>
                    <span className="font-medium text-slate-300">Email:</span>{" "}
                    <span className="text-slate-300">{volunteer.email}</span>
                  </p>
                  <p>
                    <span className="font-medium text-slate-300">Phone:</span>{" "}
                    <span className="text-slate-300">{volunteer.phone}</span>
                  </p>
                  {volunteer.organisation && (
                    <p>
                      <span className="font-medium text-slate-300">Organisation:</span>{" "}
                      <span className="text-slate-300">{volunteer.organisation}</span>
                    </p>
                  )}
                  {volunteer.location && (
                    <p>
                      <span className="font-medium text-slate-300">Location:</span>{" "}
                      <span className="text-slate-300">{volunteer.location}</span>
                    </p>
                  )}
                  {volunteer.badge && (
                    <p>
                      <span className="font-medium text-slate-300">Badge:</span>{" "}
                      <span className="inline-block ml-2 px-2 py-0.5 bg-indigo-600/70 rounded text-xs text-white">{volunteer.badge}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Volunteers;
