import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  // keep token in state so that changes trigger a re‑render and the
  // router can immediately redirect after login without requiring a
  // manual page refresh.
  const [token, setToken] = useState(localStorage.getItem("token"));

  // listen for storage events so that other tabs/contexts can update
  // the token state if it changes elsewhere (optional but helpful).
  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={
            token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />
          }
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
