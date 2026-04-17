import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SetPassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/set-password", {
        username,
        password
      });

      alert(res.data.message);
      navigate("/");
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-4">Set Your Password</h2>

      <input
        placeholder="Username"
        className="border p-2 mb-3 block"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        className="border p-2 mb-3 block"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Save Password
      </button>
    </div>
  );
}

export default SetPassword;
