import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

function RoomAllotment() {
  const navigate = useNavigate();
  const currentUsername = sessionStorage.getItem("username") || "";

  const [form, setForm] = useState({
    name: "",
    id: "",
    dept: "",
    year: "1st Year",
    block: "Block A",
    room: "",
    floor: "Ground",
    type: "Single",
    phone: "",
    parent: "",
    agree: false,
  });
  const [allRequests, setAllRequests] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const hasShownAccessAlert = useRef(false);

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

    const loadRequests = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/room-requests`, {
          params: { username: currentUsername },
        });
        if (!ignore) {
          setAllRequests(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadRequests();

    return () => {
      ignore = true;
    };
  }, [currentUsername, navigate]);

  const requests = useMemo(() => allRequests, [allRequests]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/room-requests`, {
        params: { username: currentUsername },
      });
      setAllRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    if (!form.agree) {
      alert("Please confirm details");
      return;
    }

    axios.post(`${API_BASE_URL}/room-requests`, {
      ...form,
      collegeId: form.id,
      username: currentUsername,
    }).then(() => {
      fetchRequests();
    }).catch((err) => {
      console.error(err);
      alert("Unable to submit room request");
    });

    setForm({
      name: "",
      id: "",
      dept: "",
      year: "1st Year",
      block: "Block A",
      room: "",
      floor: "Ground",
      type: "Single",
      phone: "",
      parent: "",
      agree: false,
    });

    alert("Room request submitted successfully!");
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 mt-16 pb-16 space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">
            Room Allotment Request Form
          </h2>

          <p className="text-center text-gray-500 mb-8">
            Enter student and room details carefully
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Student Name" className="input" />
            <input name="id" value={form.id} onChange={handleChange} placeholder="College ID" className="input" />
            <input name="dept" value={form.dept} onChange={handleChange} placeholder="Department" className="input" />

            <select name="year" value={form.year} onChange={handleChange} className="input">
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>

            <select name="block" value={form.block} onChange={handleChange} className="input">
              <option>Block A</option>
              <option>Block B</option>
              <option>Block C</option>
            </select>

            <input name="room" value={form.room} onChange={handleChange} placeholder="Preferred Room Number" className="input" />

            <select name="floor" value={form.floor} onChange={handleChange} className="input">
              <option>Ground</option>
              <option>1st</option>
              <option>2nd</option>
              <option>3rd</option>
            </select>

            <select name="type" value={form.type} onChange={handleChange} className="input">
              <option>Single</option>
              <option>Double</option>
              <option>Triple</option>
            </select>

            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="input" />
            <input name="parent" value={form.parent} onChange={handleChange} placeholder="Parent Contact" className="input" />

            <div className="md:col-span-2 flex gap-2 items-center">
              <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
              <span>I confirm the above details are correct</span>
            </div>

            <div className="md:col-span-2">
              <button onClick={handleSubmit} className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl">
                Submit Room Allocation
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">Your Room Request Status</h3>

          {requests.length === 0 ? (
            <p className="text-gray-500">No room requests submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="p-2 text-left">Student</th>
                    <th className="p-2 text-left">Preferred</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Allotted</th>
                    <th className="p-2 text-left">Admin Reply</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id} className="border-b align-top">
                      <td className="p-2">
                        <div className="font-medium">{request.name}</div>
                        <div className="text-xs text-gray-500">{request.collegeId}</div>
                      </td>
                      <td className="p-2">{request.block}, {request.floor}, {request.type}</td>
                      <td className="p-2">{request.status}</td>
                      <td className="p-2">{request.allottedRoom || "Not allotted yet"}</td>
                      <td className="p-2">{request.adminReply || "Awaiting admin update"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default RoomAllotment;
