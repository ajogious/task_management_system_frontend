import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import API_ENDPOINTS from "../services/API_ENDPOINTS";

function AdminDashboard() {
  const [taskStats, setTaskStats] = useState({
    totalUsers: 0,
    totalMonthlyUsers: 0,
    totalGenders: 0,
    totalFemaleUsers: 0,
    totalMaleUsers: 0,
    totalUsersTasks: 0,
    totalCompletedTasks: 0,
    totalPendingTasks: 0,
  });
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  const getAuthToken = () => localStorage.getItem("authToken");

  useEffect(() => {
    const authenticateUser = () => {
      const storedUserDetails = localStorage.getItem("userDetails");
      if (!storedUserDetails) {
        navigate("/login");
        return null;
      }
      setUserDetails(JSON.parse(storedUserDetails));
    };
    authenticateUser();
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    const fetchTaskStats = async () => {
      if (!userDetails) return;

      const token = getAuthToken();
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          API_ENDPOINTS.ADMIN.ADMIN_USERS_STATS,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTaskStats(response.data || {});
      } catch (error) {
        if (error.response?.status === 403) {
          navigate("/login");
        }
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

  const TaskCard = ({ title, count, subtitle, borderClass = "primary" }) => (
    <div className="col-md-3 col-12">
      <div className={`card border-4 border-${borderClass} p-3`}>
        <h4 className="card-title">{title}</h4>
        {subtitle && <p className="card-subtitle text-muted">{subtitle}</p>}
        <hr />
        <h1 className="card-text">{count || 0}</h1>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div
        className="AdminDashboard"
        style={{ marginTop: "120px", marginBottom: "200px" }}
      >
        <h2>Admin Dashboard</h2>
        <h4 className="mt-3 text-center">Task Management Analytics</h4>
        <div className="row justify-content-center text-center gap-4 mt-4">
          <TaskCard title="Total Users" count={taskStats.totalUsers} />
          <TaskCard
            title="Total Monthly Users"
            count={taskStats.totalMonthlyUsers}
            subtitle={`For ${currentMonth}`}
          />
          <TaskCard title="Total Genders" count={taskStats.totalGenders} />
          <TaskCard title="Total Male Users" count={taskStats.totalMaleUsers} />
          <TaskCard
            title="Total Female Users"
            count={taskStats.totalFemaleUsers}
          />
          <TaskCard
            title="Total Users Tasks"
            count={taskStats.totalUsersTasks}
          />
          <TaskCard
            title="Total Completed Tasks"
            count={taskStats.totalCompletedTasks}
            borderClass="success"
          />
          <TaskCard
            title="Total Pending Tasks"
            count={taskStats.totalPendingTasks}
            borderClass="warning"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
