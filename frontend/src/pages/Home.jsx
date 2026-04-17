import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

function openLoginModal(role) {
  window.dispatchEvent(
    new CustomEvent("open-login-modal", {
      detail: { role },
    })
  );
}

function Home() {
  const [latestNotice, setLatestNotice] = useState("The announcements are now live!");

  useEffect(() => {
    const fetchLatestNotice = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/notices`);
        if (res.data.length > 0) {
          setLatestNotice(res.data[0].text);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchLatestNotice();
  }, []);

  return (
    <>
      <section
        className="bg-gradient-to-r from-blue-800 to-blue-600 text-white w-full h-[60vh] min-h-[350px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/image3.png')" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Hostel <span className="text-blue-200">Management</span> & <br /> Grievance Control System
            </h1>

            <p className="mb-6 text-gray-200">
              Efficient hostel management & grievance resolution
            </p>

            <div className="flex gap-4">
              <button className="bg-white text-blue-800 px-6 py-2 rounded font-semibold">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
            <h3 className="font-bold text-lg">🛏 Room Allocation</h3>
            <p className="text-sm text-gray-600 mt-2">
              Manage room assignments & availability.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
            <h3 className="font-bold text-lg">🚨 Grievance Management</h3>
            <p className="text-sm text-gray-600 mt-2">
              Submit & track complaints easily.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
            <h3 className="font-bold text-lg">⚙ Admin Dashboard</h3>
            <p className="text-sm text-gray-600 mt-2">
              Control and monitor hostel activities.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold mb-4">For Students</h3>

            <ul className="space-y-2 text-gray-700">
              <li>Apply for Rooms</li>
              <li>Lodge Complaints</li>
              <li>Track Status</li>
            </ul>

            <button
              onClick={() => openLoginModal("student")}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Student Portal
            </button>
          </div>

          <div
            className="w-40 h-60 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: "url('/image1.png')" }}
          />
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold mb-4">For Admins</h3>

            <ul className="space-y-2 text-gray-700">
              <li>Manage Allocations</li>
              <li>Resolve Grievances</li>
              <li>View Reports</li>
              <li>Notices</li>
            </ul>

            <button
              onClick={() => openLoginModal("admin")}
              className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Admin Portal
            </button>
          </div>

          <div
            className="w-40 h-60 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: "url('/image2.png')" }}
          />
        </div>
      </section>

      <section className="bg-blue-50 py-4">
        <div className="max-w-5xl mx-auto px-6 text-sm text-blue-800">
             🔊 <strong>Latest Announcements:</strong> {latestNotice}
        </div>
      </section>
    </>
  );
}

export default Home;
