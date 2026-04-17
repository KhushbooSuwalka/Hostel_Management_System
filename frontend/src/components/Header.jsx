import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

function Header() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(sessionStorage.getItem("userRole")));
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setRole("student");
    setShowSetPassword(false);
    setShowForgotPassword(false);
  };

  useEffect(() => {
    const openLoginModal = (event) => {
      const nextRole = event.detail?.role;
      if (nextRole === "student" || nextRole === "admin") {
        setRole(nextRole);
      }
      setModalOpen(true);
    };

    window.addEventListener("open-login-modal", openLoginModal);
    return () => window.removeEventListener("open-login-modal", openLoginModal);
  }, []);

  const forgotPasswordUser = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/forgot-password`, {
        username,
        password,
      });

      alert(res.data.message);
      setShowForgotPassword(false);
    } catch (err) {
      console.log(err);
      alert("Error");
    }
  };

  const setPasswordUser = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/set-password`, {
        username,
        password,
      });

      alert(res.data.message);
      setShowSetPassword(false);
    } catch (err) {
      console.log(err);
      alert("Error");
    }
  };

  const loginUser = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
        role,
      });

      if (res.data.message === "Login successful") {
        sessionStorage.setItem("userRole", res.data.role);
        sessionStorage.setItem("username", res.data.username);
        setIsLoggedIn(true);
        setModalOpen(false);

        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/room");
        }
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("username");
    setIsLoggedIn(false);
    resetForm();
    navigate("/");
  };

  const navLinkClassName = ({ isActive }) =>
    `border-b-2 pb-1 ${isActive ? "border-white text-white" : "border-transparent text-white"}`;

  return (
    <header>
      <nav className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
          <div className="text-xl text-blue-200 font-bold flex items-center gap-2">
             <i className="fas fa-building"></i> Hostel Management
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden border-2 border-gray-500 rounded-lg p-2"
          >
            =
          </button>

          <ul className="hidden md:flex gap-6 font-medium ">
            <li><NavLink to="/" end className={navLinkClassName}>Home</NavLink></li>
            <li><NavLink to="/room" className={navLinkClassName}>Room Request</NavLink></li>
            <li><NavLink to="/grievance" className={navLinkClassName}>Grievance</NavLink></li>
            <li><NavLink to="/contact" className={navLinkClassName}>Contact</NavLink></li>
            <li><NavLink to="/admin" className={navLinkClassName}>Admin</NavLink></li>
            <li>
              <button
                onClick={isLoggedIn ? logout : () => setModalOpen(true)}
                className="bg-white text-blue-900 px-4 py-1 rounded"
              >
                {isLoggedIn ? "Logout" : "Login"}
              </button>
            </li>
          </ul>
        </div>

        {menuOpen && (
          <div className="px-6 pb-6 md:hidden">
            <ul className="space-y-4 text-white">
              <li><NavLink to="/" end className={navLinkClassName}>Home</NavLink></li>
              <li><NavLink to="/room" className={navLinkClassName}>Room Request</NavLink></li>
              <li><NavLink to="/grievance" className={navLinkClassName}>Grievance</NavLink></li>
              <li><NavLink to="/contact" className={navLinkClassName}>Contact</NavLink></li>
              <li><NavLink to="/admin" className={navLinkClassName}>Admin</NavLink></li>
            </ul>

            <button
              onClick={isLoggedIn ? logout : () => setModalOpen(true)}
              className="mt-4 bg-white text-blue-900 px-4 py-1 rounded"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </div>
        )}
      </nav>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
              className="absolute top-3 right-4 text-3xl text-gray-500"
            >
              &times;
            </button>

            <div className="flex justify-center mt-8">
              <img src="/image4.png" className="w-24 h-24 rounded-full border" alt="avatar" />
            </div>

            <div className="px-8 py-6 space-y-4">
              {!showSetPassword && !showForgotPassword && (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full border px-4 py-2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full border px-4 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <select
                    className="w-full border px-4 py-2"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    onClick={loginUser}
                    className="w-full bg-green-600 text-white py-2 rounded"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => {
                      setShowSetPassword(true);
                      setShowForgotPassword(false);
                    }}
                    className="text-blue-600 text-sm"
                  >
                    First Time? Set Password
                  </button>

                  <button
                    onClick={() => {
                      setShowForgotPassword(true);
                      setShowSetPassword(false);
                    }}
                    className="text-blue-600 ml-5 text-sm"
                  >
                    Forgot Password?
                  </button>

                  <label className="flex gap-2">
                    <input type="checkbox" defaultChecked />
                    Remember me
                  </label>
                </>
              )}

              {showSetPassword && (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full border px-4 py-2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border px-4 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    onClick={setPasswordUser}
                    className="w-full bg-blue-600 text-white py-2 rounded"
                  >
                    Save Password
                  </button>

                  <button
                    onClick={() => setShowSetPassword(false)}
                    className="text-gray-600 text-sm"
                  >
                    Back to Login
                  </button>
                </>
              )}

              {showForgotPassword && (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full border px-4 py-2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border px-4 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    onClick={forgotPasswordUser}
                    className="w-full bg-yellow-600 text-white py-2 rounded"
                  >
                    Reset Password
                  </button>

                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="text-gray-600 text-sm"
                  >
                    Back to Login
                  </button>
                </>
              )}
            </div>

            <div className="bg-gray-100 px-8 py-4">
              <button
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
