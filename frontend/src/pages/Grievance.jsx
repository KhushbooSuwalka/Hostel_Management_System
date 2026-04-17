import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

function Grievance() {
  const navigate = useNavigate();
  const currentUsername = sessionStorage.getItem("username") || "";

  const [form, setForm] = useState({
    name: "",
    room: "",
    studentId: "",
    category: "",
    description: "",
  });
  const [allGrievances, setAllGrievances] = useState([]);
  const [proofSelected, setProofSelected] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const hasShownAccessAlert = useRef(false);

  const fetchGrievances = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/grievances`, {
        params: { username: currentUsername },
      });
      setAllGrievances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role !== "student") {
      if (!hasShownAccessAlert.current) {
        hasShownAccessAlert.current = true;
        alert("Please login as Student");
      }
      setIsAuthorized(false);
      navigate("/", { replace: true });
      return;
    }

    setIsAuthorized(true);
    let ignore = false;

    const loadGrievances = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/grievances`, {
          params: { username: currentUsername },
        });
        if (!ignore) {
          setAllGrievances(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadGrievances();

    return () => {
      ignore = true;
    };
  }, [currentUsername, navigate]);

  const grievances = useMemo(() => allGrievances, [allGrievances]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const addGrievance = () => {
    const { name, room, studentId, category, description } = form;

    if (!name || !room || !studentId || !category || !description) {
      alert("Please fill all fields");
      return;
    }

    axios.post(`${API_BASE_URL}/grievances`, {
      ...form,
      username: currentUsername,
    }).then(() => {
      fetchGrievances();
    }).catch((err) => {
      console.error(err);
      alert("Unable to submit grievance");
    });

    setForm({
      name: "",
      room: "",
      studentId: "",
      category: "",
      description: "",
    });
    setProofSelected(false);
  };

  const deleteGrievance = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/grievances/${id}`);
      fetchGrievances();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="max-w-7xl mx-auto mt-6 mb-6 rounded-xl bg-blue-900 py-10 text-center text-blue-200">
        <h1 className="text-2xl font-bold">Grievance Management</h1>
        <p className="text-white mt-2">Submit and track your grievances</p>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-6">Submit Grievance</h2>

          <div className="space-y-4">
            <input id="name" value={form.name} onChange={handleChange} placeholder="Student Name" className="w-full border px-4 py-2 rounded" />
            <input id="room" value={form.room} onChange={handleChange} placeholder="Room No" className="w-full border px-4 py-2 rounded" />
            <input id="studentId" value={form.studentId} onChange={handleChange} placeholder="Student ID" className="w-full border px-4 py-2 rounded" />

            <select id="category" value={form.category} onChange={handleChange} className="w-full border px-4 py-2 rounded">
              <option value="">Select Category</option>
              <option>Hostel</option>
              <option>Mess</option>
              <option>Maintenance</option>
              <option>Security</option>
              <option>Other</option>
            </select>

            <textarea id="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border px-4 py-2 rounded" />

            <label className={`flex justify-center border px-4 py-2 rounded cursor-pointer ${proofSelected ? "bg-blue-200 font-semibold" : ""}`}>
              {proofSelected ? "Proof Uploaded" : "Choose Image"}
              <input type="file" className="hidden" onChange={() => setProofSelected(true)} />
            </label>

            <button onClick={addGrievance} className="w-full bg-blue-900 text-white py-3 rounded">
              Submit Grievance
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Your Grievances</h2>

          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Status</th>
                <th className="p-2">Admin Reply</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {grievances.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">No grievances yet</td>
                </tr>
              ) : (
                grievances.map((grievance) => (
                  <tr key={grievance._id} className="border-b align-top">
                    <td className="p-2">
                      <div className="font-medium">{grievance.name}</div>
                      <div className="text-xs text-gray-500">Room {grievance.room}</div>
                    </td>
                    <td className="p-2">{grievance.category}</td>
                    <td className="p-2">{grievance.status}</td>
                    <td className="p-2">{grievance.adminReply || "Awaiting admin response"}</td>
                    <td className="p-2">
                      <button onClick={() => deleteGrievance(grievance._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Grievance;
