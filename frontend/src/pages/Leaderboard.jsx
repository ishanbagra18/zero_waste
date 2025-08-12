import React, { useEffect, useState } from "react";
import api from "../util/api";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [ngoRes, volunteerRes, vendorRes] = await Promise.all([
          api.get("/api/users/allngo", { headers }),
          api.get("/api/users/allvolunteer", { headers }),
          api.get("/api/users/allvendor", { headers }),
        ]);

        const ngos = ngoRes.data.ngos || [];
        const volunteers = volunteerRes.data.volunteers || [];
        const vendors = vendorRes.data.vendors || [];

        const allUsers = [
          ...ngos.map((u) => ({ ...u, roleType: "NGO" })),
          ...volunteers.map((u) => ({ ...u, roleType: "Volunteer" })),
          ...vendors.map((u) => ({ ...u, roleType: "Vendor" })),
        ];

        allUsers.sort((a, b) => (b.points || 0) - (a.points || 0));
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchAll();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg mb-8 animate-pulse">
        🏆 ZeroWaste Leaderboard
      </h1>

      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/10 text-yellow-300 uppercase text-sm tracking-wider">
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              // Assign medal colors to top 3 ranks
              const rankColors = [
                "bg-yellow-500/20 text-yellow-300", // 1st
                "bg-gray-300/20 text-gray-300", // 2nd
                "bg-amber-700/20 text-amber-400", // 3rd
              ];
              return (
                <tr
                  key={user._id || index}
                  className={`border-b border-gray-700 hover:bg-white/5 transition-all duration-300 ${
                    index < 3 ? rankColors[index] : ""
                  }`}
                >
                  <td className="px-4 py-3 font-bold text-lg">{index + 1}</td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={user.photo?.url || "https://via.placeholder.com/40"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/20"
                    />
                    <span className="font-medium">{user.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20">
                      {user.roleType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{user.points || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
