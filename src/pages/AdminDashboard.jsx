import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
          "http://localhost:8080/api/admin/dashboard/stats",
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

  function TaskCard({ title, count, subtitle }) {
    return (
      <div className="col-md-3 col-12">
        <div className="card border-4 border-primary p-3">
          <h4 className="card-title">{title}</h4>
          {subtitle && <p className="card-subtitle text-muted">{subtitle}</p>}
          <hr />
          <h1 className="card-text">{count}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        className="AdminDashboard"
        style={{
          marginTop: "120px",
          marginBottom: "200px",
        }}
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
          />
          <TaskCard
            title="Total Pending Tasks"
            count={taskStats.totalPendingTasks}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
