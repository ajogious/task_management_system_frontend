import React from "react";
import { useNavigate } from "react-router-dom";

const CTO = () => {
  const navigate = useNavigate();

  return (
    <button className="btn btn-secondary" onClick={() => navigate("/tasks")}>
      View All Tasks
    </button>
  );
};

export default CTO;
