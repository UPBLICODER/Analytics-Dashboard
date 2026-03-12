import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login(props) {
  const [mode, setMode] = useState("login"); // or "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // accept a prop that the App component passes so we can
  // immediately update its token state when the user logs in.
  const { setToken } = props;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (mode === "login") {
        res = await api.post("/auth/login", { username, password });
      } else {
        // register
        res = await api.post("/auth/register", {
          username,
          password,
          age: Number(age),
          gender,
        });
      }
      const { token, userId } = res.data;
      if (token) {
        localStorage.setItem("token", token);
        setToken(token); // trigger App re‑render so route props update
      }
      if (userId) localStorage.setItem("userId", userId);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          width: "90%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          {mode === "login" ? "Login" : "Register"}
        </h2>
        {error && (
          <div style={{ color: "#e53e3e", fontSize: "14px" }}>{error}</div>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "14px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "14px" }}
        />
        {mode === "register" && (
          <>
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              style={{ padding: "10px", fontSize: "14px" }}
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              style={{ padding: "10px", fontSize: "14px" }}
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </>
        )}
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {mode === "login" ? "Sign In" : "Create Account"}
        </button>
        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#555",
            marginTop: "10px",
          }}
        >
          {mode === "login" ? (
            <span>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                style={{
                  color: "#3b82f6",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Register
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{
                  color: "#3b82f6",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
