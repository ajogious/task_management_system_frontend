import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import API_ENDPOINTS from "../services/API_ENDPOINTS";

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
          API_ENDPOINTS.DASHBOARD.STATS(userDetails.id),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTaskStats(response.data);
      } catch (error) {
        if (error.response?.status === 403) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTaskStats();
  }, [userDetails, navigate]);

  if (loading) {
    return <Spinner />;
  }

  if (!userDetails) {
    return null;
  }

  const { fullName, gender } = userDetails;
  const firstName = fullName?.split(" ")[0] || "User";
  const formattedGender = gender === "Male" ? "Mr." : "Ms.";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const TaskCard = ({ title, count }) => (
    <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
      <div className="card border-4 border-primary p-3 shadow-sm">
        <h4 className="card-title">{title}</h4>
        <hr />
        <h1 className="card-text">{count}</h1>
      </div>
    </div>
  );

  return (
    <div
      className="container py-5"
      style={{
        marginTop: "100px",
      }}
    >
      <div className="UserDashboard text-center">
        <h2 className="mb-4">User Dashboard</h2>
        <div className="display-6 mb-4" style={{ fontSize: "18px" }}>
          {getGreeting()} {formattedGender} {firstName}!
        </div>
        <h4 className="text-center mb-4">Task Summaries</h4>
        <div className="row justify-content-center">
          <TaskCard title="Total Tasks" count={taskStats.totalTasks} />
          <TaskCard title="Completed Tasks" count={taskStats.completedTasks} />
          <TaskCard title="Pending Tasks" count={taskStats.pendingTasks} />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
