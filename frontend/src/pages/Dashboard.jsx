import { useEffect, useState } from "react";
import api from "../services/api";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";

export default function Dashboard() {
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadCookies();
  }, []);

  useEffect(() => {
    fetchAnalytics();
    if (selectedFeature) {
      fetchLine(selectedFeature);
    }
  }, [age, gender, startDate, endDate, selectedFeature]);

  const fetchAnalytics = async () => {
    try {
      const params = {};

      if (age) params.age = age;
      if (gender) params.gender = gender;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get("/analytics", { params });

      setBarData(res.data);

      if (res.data.length > 0 && !selectedFeature) {
        setSelectedFeature(res.data[0].feature_name);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLine = async (feature) => {
    try {
      const params = { feature };

      if (age) params.age = age;
      if (gender) params.gender = gender;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get("/analytics", { params });

      setLineData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBarClick = async (feature) => {
    setSelectedFeature(feature);

    await fetchLine(feature);

    await api.post("/track", {
      user_id: userId,
      feature_name: "bar_chart_click",
    });
  };

  const handleAgeFilter = async (value) => {
    setAge(value);

    document.cookie = `age_filter=${value}`;

    await api.post("/track", {
      user_id: userId,
      feature_name: "age_filter",
    });
  };

  const handleGenderFilter = async (value) => {
    setGender(value);

    document.cookie = `gender_filter=${value}`;

    await api.post("/track", {
      user_id: userId,
      feature_name: "gender_filter",
    });
  };

  const handleStartDate = async (value) => {
    setStartDate(value);

    document.cookie = `start_date=${value}`;

    await api.post("/track", {
      user_id: userId,
      feature_name: "date_filter",
    });
  };

  const handleEndDate = async (value) => {
    setEndDate(value);

    document.cookie = `end_date=${value}`;

    await api.post("/track", {
      user_id: userId,
      feature_name: "date_filter",
    });
  };

  const loadCookies = () => {
    const cookies = document.cookie.split(";");

    cookies.forEach((cookie) => {
      const [key, value] = cookie.trim().split("=");

      if (key === "age_filter") setAge(value);
      if (key === "gender_filter") setGender(value);
      if (key === "start_date") setStartDate(value);
      if (key === "end_date") setEndDate(value);
    });
  };

  return (
    <div
      style={{
        width: "90%",
        maxWidth: "1000px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "20px",
        backgroundColor: "#ffffff",
      }}
    >
      <h2>📊 Product Analytics Dashboard</h2>

      {/* Filters */}

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <label>Age:</label>

        <select value={age} onChange={(e) => handleAgeFilter(e.target.value)}>
          <option value="">All</option>
          <option value="<18">&lt;18</option>
          <option value="18-40">18-40</option>
          <option value=">40">&gt;40</option>
        </select>

        <label style={{ marginLeft: "20px" }}>Gender:</label>

        <select
          value={gender}
          onChange={(e) => handleGenderFilter(e.target.value)}
        >
          <option value="">All</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <label style={{ marginLeft: "20px" }}>Start Date:</label>

        <input
          type="date"
          value={startDate}
          onChange={(e) => handleStartDate(e.target.value)}
        />

        <label style={{ marginLeft: "10px" }}>End Date:</label>

        <input
          type="date"
          value={endDate}
          onChange={(e) => handleEndDate(e.target.value)}
        />
      </div>

      {/* Charts container: flex so bar and line appear side-by-side on wide
          screens and reserve space to avoid layout shift */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
          width: "100%",
          justifyContent: "center",
        }}
      >
        {/* bar chart always present (placeholder when loading) */}
        <div style={{ flex: 1, minWidth: "400px", height: "400px" }}>
          {barData.length > 0 ? (
            <BarChart
              data={barData}
              onBarClick={handleBarClick}
              selectedFeature={selectedFeature}
            />
          ) : (
            <p style={{ textAlign: "center", marginTop: "180px" }}>Loading</p>
          )}
        </div>

        {/* line chart area always reserved too */}
        <div style={{ flex: 1, minWidth: "400px", height: "400px" }}>
          <h3 style={{ textAlign: "center", marginTop: 0, height: "24px" }}>
            {selectedFeature ? `${selectedFeature} Trend` : ""}
          </h3>
          {selectedFeature ? (
            lineData.length > 0 ? (
              <LineChart data={lineData} />
            ) : (
              <p style={{ textAlign: "center", marginTop: "160px" }}>
                No trend data
              </p>
            )
          ) : (
            <p style={{ textAlign: "center", marginTop: "160px" }}>
              Select a feature
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
