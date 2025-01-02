import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");

    if (!storedUserDetails) {
      navigate("/login");
      return;
    }

    setUserDetails(JSON.parse(storedUserDetails));
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    const fetchTaskStats = async () => {
      if (!userDetails) return;

      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/dashboard/stats/${userDetails.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTaskStats(response.data);
      } catch (error) {
        if (error.response?.status === 403) {
          navigate("/login");
        }
      }
    };

    fetchTaskStats();
  }, [userDetails, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userDetails) {
    return null;
  }

  const firstName = userDetails.fullName?.split(" ")[0] || "User";
  const gender = userDetails.gender || "Unknown";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  function TaskCard({ title, count }) {
    return (
      <div className="col-md-3 col-12">
        <div className="card border-4 border-primary p-3">
          <h4 className="card-title">{title}</h4>
          <hr />
          <h1 className="card-text">{count}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        className="UserDashboard"
        style={{
          marginTop: "100px",
        }}
      >
        <h2>User Dashboard</h2>
        <div className="display-6" style={{ fontSize: "18px" }}>
          {getGreeting()} {gender === "Male" ? "Mr." : "Ms."} {firstName}!
        </div>
        <h4 className="mt-3 text-center">Task Summaries</h4>
        <div className="row justify-content-center text-center gap-4 mt-4">
          <TaskCard title="Total Tasks" count={taskStats.totalTasks} />
          <TaskCard title="Completed Tasks" count={taskStats.completedTasks} />
          <TaskCard title="Pending Tasks" count={taskStats.pendingTasks} />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
