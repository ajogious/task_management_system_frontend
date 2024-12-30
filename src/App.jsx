import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgottenPassword from "./pages/ForgottenPassword";
import UserDashboard from "./pages/UserDashboard";
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";
import "./App.css";
import Profile from "./pages/Profile";
import Message from "./components/Message";
import UpdateProfile from "./pages/UpdateProfile";
import AddTask from "./pages/AddTask";
import ViewTasks from "./pages/ViewTasks";
import UpdateTask from "./pages/UpdateTask";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";

function App() {
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [userImage, setUserImage] = useState(null);

  return (
    <div className="App">
      <Navbar
        setMessage={setMessage}
        setAlertType={setAlertType}
        userImage={userImage}
        setUserImage={setUserImage}
      />
      <Logout />
      <Message message={message} alertType={alertType} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgottenPassword />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route
          path="/profile/:userId"
          element={<Profile setUserImage={setUserImage} />}
        />
        <Route
          path="/update-profile/:userId"
          element={<UpdateProfile setUserImage={setUserImage} />}
        />
        <Route path="/add-task" element={<AddTask />} />
        <Route path="/view-tasks/:userId" element={<ViewTasks />} />
        <Route path="/update-task/:taskId" element={<UpdateTask />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Routes>
    </div>
  );
}

export default App;
