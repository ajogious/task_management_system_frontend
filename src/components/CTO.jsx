import React from "react";
import { useNavigate } from "react-router-dom";

const CTO = () => {
  const navigate = useNavigate();

  const handleViewTasks = () => {
    navigate("/tasks");
  };

  return (
    <button className="btn btn-secondary" onClick={handleViewTasks}>
      View All Tasks
    </button>
  );
};

export default CTO;
