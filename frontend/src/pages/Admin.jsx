import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
const emptyStudentForm = {
  username: "",
  fullName: "",
  email: "",
  phone: "",
  department: "",
  year: "",
  room: "",
};

function Admin() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("grievance");
  const [notices, setNotices] = useState([]);
  const [noticeInput, setNoticeInput] = useState("");
  const [studentForm, setStudentForm] = useState(emptyStudentForm);
  const [studentMessage, setStudentMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentError, setStudentError] = useState("");
  const [savingStudentId, setSavingStudentId] = useState("");
  const [deletingStudentId, setDeletingStudentId] = useState("");
  const [deletingNoticeId, setDeletingNoticeId] = useState("");
  const [grievances, setGrievances] = useState([]);
  const [roomRequests, setRoomRequests] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const hasShownAccessAlert = useRef(false);

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role !== "admin") {
      if (!hasShownAccessAlert.current) {
        hasShownAccessAlert.current = true;
        alert("Access Denied! Admin login required.");
      }
      setIsAuthorized(false);
      navigate("/", { replace: true });
      return;
    }

    setIsAuthorized(true);
    fetchStudents();
    fetchGrievances();
    fetchRoomRequests();
    fetchNotices();
  }, [navigate]);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      setStudentError("");
      const res = await axios.get(`${API_BASE_URL}/students`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      setStudentError("Unable to load students");
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchGrievances = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/grievances`);
      setGrievances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoomRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/room-requests`);
      setRoomRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/notices`);
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const summary = useMemo(() => {
    const pending =
      grievances.filter((item) => item.status === "Pending").length +
      roomRequests.filter((item) => item.status === "Pending").length;
    const inProgress =
      grievances.filter((item) => item.status === "In Progress").length +
      roomRequests.filter((item) => item.status === "In Progress").length;
    const resolved =
      grievances.filter((item) => item.status === "Resolved").length +
      roomRequests.filter((item) => item.status === "Allotted").length;

    return { pending, inProgress, resolved };
  }, [grievances, roomRequests]);

  const addNotice = () => {
    if (noticeInput.trim() === "") return;
    axios.post(`${API_BASE_URL}/notices`, { text: noticeInput })
      .then(() => {
        setNoticeInput("");
        fetchNotices();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteNotice = async (noticeId) => {
    const confirmed = window.confirm("Delete this notice?");
    if (!confirmed) {
      return;
    }

    try {
      setDeletingNoticeId(noticeId);
      await axios.delete(`${API_BASE_URL}/notices/${noticeId}`);
      fetchNotices();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingNoticeId("");
    }
  };

  const handleStudentFormChange = (e) => {
    const { name, value } = e.target;
    setStudentForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const addStudent = async () => {
    if (!studentForm.username.trim()) {
      setStudentMessage("Username is required");
      return;
    }

    try {
      const payload = Object.fromEntries(
        Object.entries(studentForm).map(([key, value]) => [key, value.trim()])
      );
      const res = await axios.post(`${API_BASE_URL}/create-student`, payload);
      setStudentMessage(res.data.message);
      setStudentForm(emptyStudentForm);
      fetchStudents();
    } catch (err) {
      console.error(err);
      setStudentMessage(err.response?.data?.message || "Error adding student");
    }
  };

  const handleEditableStudentChange = (studentId, field, value) => {
    setStudents((current) =>
      current.map((student) =>
        student._id === studentId
          ? {
              ...student,
              [field]: value,
            }
          : student
      )
    );
  };

  const saveStudent = async (student) => {
    if (!student.username.trim()) {
      setStudentMessage("Username is required");
      return;
    }

    try {
      setSavingStudentId(student._id);
      setStudentMessage("");
      const payload = {
        username: (student.username || "").trim(),
        fullName: (student.fullName || "").trim(),
        email: (student.email || "").trim(),
        phone: (student.phone || "").trim(),
        department: (student.department || "").trim(),
        year: (student.year || "").trim(),
        room: (student.room || "").trim(),
      };

      const res = await axios.put(`${API_BASE_URL}/students/${student._id}`, payload);
      setStudents((current) =>
        current.map((item) => (item._id === student._id ? res.data.student : item))
      );
      setStudentMessage("Student details updated");
    } catch (err) {
      console.error(err);
      setStudentMessage(err.response?.data?.message || "Error updating student");
    } finally {
      setSavingStudentId("");
    }
  };

  const deleteStudent = async (studentId) => {
    const confirmed = window.confirm("Delete this student entry?");
    if (!confirmed) {
      return;
    }

    try {
      setDeletingStudentId(studentId);
      setStudentError("");
      setStudentMessage("");
      await axios.delete(`${API_BASE_URL}/students/${studentId}`);
      await fetchStudents();
      setStudentMessage("Student deleted successfully");
    } catch (err) {
      console.error(err);
      setStudentError(err.response?.data?.message || "Error deleting student");
    } finally {
      setDeletingStudentId("");
    }
  };

  const updateGrievance = async (id, field, value) => {
    const updated = grievances.map((item) =>
      item._id === id
        ? {
            ...item,
            [field]: value,
          }
        : item
    );
    setGrievances(updated);

    const target = updated.find((item) => item._id === id);
    try {
      await axios.put(`${API_BASE_URL}/grievances/${id}`, {
        status: target.status,
        adminReply: target.adminReply,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateRoomRequest = async (requestId, field, value) => {
    const updated = roomRequests.map((item) =>
      item._id === requestId
        ? {
            ...item,
            [field]: value,
          }
        : item
    );
    setRoomRequests(updated);

    const target = updated.find((item) => item._id === requestId);
    try {
      await axios.put(`${API_BASE_URL}/room-requests/${requestId}`, {
        status: target.status,
        allottedRoom: target.allottedRoom,
        adminReply: target.adminReply,
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-900 mt-4 rounded-xl shadow-sm p-6 mx-6">
        <h1 className="text-3xl font-bold text-center text-white">Admin</h1>
        <p className="text-center text-blue-100">
          Centralized control for grievances, room requests, notices, and student records.
        </p>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="grid md:grid-cols-4 gap-6">
          <Card title="Pending" value={String(summary.pending)} color="text-yellow-500" icon="Queue" />
          <Card title="In Progress" value={String(summary.inProgress)} color="text-blue-500" icon="Review" />
          <Card title="Resolved" value={String(summary.resolved)} color="text-green-500" icon="Closed" />
          <Card title="Total Students" value={String(students.length)} color="text-indigo-500" icon="Students" />
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <ActionCard title="Grievance Management" onClick={() => setActiveSection("grievance")} />
          <ActionCard title="Room Requests" onClick={() => setActiveSection("rooms")} />
          <ActionCard title="Important Notices" onClick={() => setActiveSection("notice")} />
          <ActionCard title="Student Management" onClick={() => setActiveSection("students")} />
        </div>

        {activeSection === "grievance" && (
          <section className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Grievance Details and Reply</h2>

            {grievances.length === 0 ? (
              <p className="text-gray-500">No grievances submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {grievances.map((grievance) => (
                  <div key={grievance._id} className="rounded-xl border p-4 space-y-3">
                    <div className="grid md:grid-cols-4 gap-3 text-sm">
                      <Info label="Student" value={grievance.name} />
                      <Info label="Room" value={grievance.room} />
                      <Info label="Student ID" value={grievance.studentId} />
                      <Info label="Category" value={grievance.category} />
                    </div>
                    <Info label="Description" value={grievance.description} />
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select className="w-full rounded border px-3 py-2" value={grievance.status} onChange={(e) => updateGrievance(grievance._id, "status", e.target.value)}>
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Reply</label>
                        <textarea className="w-full rounded border px-3 py-2" value={grievance.adminReply || ""} onChange={(e) => updateGrievance(grievance._id, "adminReply", e.target.value)} placeholder="Write reply for student" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeSection === "rooms" && (
          <section className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Room Allotment and Reply</h2>

            {roomRequests.length === 0 ? (
              <p className="text-gray-500">No room requests submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {roomRequests.map((request) => (
                  <div key={request._id} className="rounded-xl border p-4 space-y-3">
                    <div className="grid md:grid-cols-4 gap-3 text-sm">
                      <Info label="Student" value={request.name} />
                      <Info label="College ID" value={request.collegeId} />
                      <Info label="Department" value={request.dept} />
                      <Info label="Year" value={request.year} />
                    </div>
                    <div className="grid md:grid-cols-4 gap-3 text-sm">
                      <Info label="Preferred Block" value={request.block} />
                      <Info label="Preferred Floor" value={request.floor} />
                      <Info label="Type" value={request.type} />
                      <Info label="Preferred Room" value={request.room || "-"} />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select className="w-full rounded border px-3 py-2" value={request.status} onChange={(e) => updateRoomRequest(request._id, "status", e.target.value)}>
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Allotted</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Allotted Room</label>
                        <input className="w-full rounded border px-3 py-2" value={request.allottedRoom || ""} onChange={(e) => updateRoomRequest(request._id, "allottedRoom", e.target.value)} placeholder="Example: A-203" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Reply</label>
                        <textarea className="w-full rounded border px-3 py-2" value={request.adminReply || ""} onChange={(e) => updateRoomRequest(request._id, "adminReply", e.target.value)} placeholder="Write room allotment note" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeSection === "notice" && (
          <section className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Important Notices</h2>
            <div className="flex gap-2 mb-4">
              <input value={noticeInput} onChange={(e) => setNoticeInput(e.target.value)} className="flex-1 border px-3 py-2" placeholder="Write notice..." />
              <button onClick={addNotice} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
            </div>
            <ul className="space-y-2">
              {notices.map((notice) => (
                <li key={notice._id} className="flex items-center justify-between gap-4 border-b pb-2">
                  <span>{notice.text}</span>
                  <button onClick={() => deleteNotice(notice._id)} disabled={deletingNoticeId === notice._id} className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-60">
                    {deletingNoticeId === notice._id ? "Deleting..." : "Delete"}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeSection === "students" && (
          <section className="bg-white p-6 rounded-xl shadow">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Student Management</h2>
                <p className="text-gray-500">See all students, total count, and edit their details.</p>
              </div>
              <div className="rounded-lg bg-blue-50 px-4 py-3 text-blue-900">
                Total Students: <span className="font-bold">{students.length}</span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <input type="text" name="username" placeholder="Username" className="border px-3 py-2 rounded" value={studentForm.username} onChange={handleStudentFormChange} />
              <input type="text" name="fullName" placeholder="Full name" className="border px-3 py-2 rounded" value={studentForm.fullName} onChange={handleStudentFormChange} />
              <input type="email" name="email" placeholder="Email" className="border px-3 py-2 rounded" value={studentForm.email} onChange={handleStudentFormChange} />
              <input type="text" name="phone" placeholder="Phone" className="border px-3 py-2 rounded" value={studentForm.phone} onChange={handleStudentFormChange} />
              <input type="text" name="department" placeholder="Department" className="border px-3 py-2 rounded" value={studentForm.department} onChange={handleStudentFormChange} />
              <input type="text" name="year" placeholder="Year" className="border px-3 py-2 rounded" value={studentForm.year} onChange={handleStudentFormChange} />
              <input type="text" name="room" placeholder="Room" className="border px-3 py-2 rounded" value={studentForm.room} onChange={handleStudentFormChange} />
              <button onClick={addStudent} className="bg-blue-600 text-white px-4 py-2 rounded">Add Student</button>
            </div>

            {studentMessage && <p className="mt-3 text-sm text-green-600">{studentMessage}</p>}
            {studentError && <p className="mt-2 text-sm text-red-600">{studentError}</p>}

            <div className="mt-6 overflow-x-auto">
              {loadingStudents ? (
                <p className="py-6 text-center text-gray-500">Loading students...</p>
              ) : students.length === 0 ? (
                <p className="py-6 text-center text-gray-500">No students found.</p>
              ) : (
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-blue-900 text-white">
                    <tr>
                      <th className="px-3 py-2 text-left">Username</th>
                      <th className="px-3 py-2 text-left">Full Name</th>
                      <th className="px-3 py-2 text-left">Email</th>
                      <th className="px-3 py-2 text-left">Phone</th>
                      <th className="px-3 py-2 text-left">Department</th>
                      <th className="px-3 py-2 text-left">Year</th>
                      <th className="px-3 py-2 text-left">Room</th>
                      <th className="px-3 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id} className="border-t border-gray-200">
                        <td className="px-3 py-2"><input className="w-32 rounded border px-2 py-1" value={student.username || ""} onChange={(e) => handleEditableStudentChange(student._id, "username", e.target.value)} /></td>
                        <td className="px-3 py-2"><input className="w-40 rounded border px-2 py-1" value={student.fullName || ""} onChange={(e) => handleEditableStudentChange(student._id, "fullName", e.target.value)} /></td>
                        <td className="px-3 py-2"><input className="w-48 rounded border px-2 py-1" value={student.email || ""} onChange={(e) => handleEditableStudentChange(student._id, "email", e.target.value)} /></td>
                        <td className="px-3 py-2"><input className="w-36 rounded border px-2 py-1" value={student.phone || ""} onChange={(e) => handleEditableStudentChange(student._id, "phone", e.target.value)} /></td>
                        <td className="px-3 py-2"><input className="w-40 rounded border px-2 py-1" value={student.department || ""} onChange={(e) => handleEditableStudentChange(student._id, "department", e.target.value)} /></td>
                        <td className="px-3 py-2"><input className="w-24 rounded border px-2 py-1" value={student.year || ""} onChange={(e) => handleEditableStudentChange(student._id, "year", e.target.value)} /></td>
                        <td className="px-3 py-2"><input className="w-24 rounded border px-2 py-1" value={student.room || ""} onChange={(e) => handleEditableStudentChange(student._id, "room", e.target.value)} /></td>
                        <td className="px-3 py-2">
                          <div className="flex gap-2">
                          <button onClick={() => saveStudent(student)} disabled={savingStudentId === student._id} className="rounded bg-green-600 px-3 py-1 text-white disabled:opacity-60">
                            {savingStudentId === student._id ? "Saving..." : "Save"}
                          </button>
                          <button onClick={() => deleteStudent(student._id)} disabled={deletingStudentId === student._id} className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-60">
                            {deletingStudentId === student._id ? "Deleting..." : "Delete"}
                          </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Card({ title, value, color, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex justify-between gap-3">
      <div>
        <p className="text-gray-500">{title}</p>
        <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
      </div>
      <div className="text-sm font-semibold text-gray-400 self-start">{icon}</div>
    </div>
  );
}

function ActionCard({ title, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer rounded-xl bg-blue-50 p-6 shadow hover:shadow-lg">
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}

export default Admin;
