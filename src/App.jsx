import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgottenPassword from "./pages/ForgottenPassword";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import AddTask from "./pages/AddTask";
import ViewTasks from "./pages/ViewTasks";
import UpdateTask from "./pages/UpdateTask";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";
import Message from "./components/Message";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [userImage, setUserImage] = useState(null);

  const routes = [
    { path: "/", element: <Home />, isProtected: false },
    { path: "/register", element: <Register />, isProtected: false },
    { path: "/login", element: <Login />, isProtected: false },
    {
      path: "/forgot-password",
      element: <ForgottenPassword />,
      isProtected: false,
    },
    { path: "/dashboard", element: <UserDashboard />, isProtected: true },
    {
      path: "/profile/:userId",
      element: <Profile setUserImage={setUserImage} />,
      isProtected: true,
    },
    {
      path: "/update-profile/:userId",
      element: <UpdateProfile setUserImage={setUserImage} />,
      isProtected: true,
    },
    { path: "/add-task", element: <AddTask />, isProtected: true },
    { path: "/view-tasks/:userId", element: <ViewTasks />, isProtected: true },
    {
      path: "/update-task/:taskId",
      element: <UpdateTask />,
      isProtected: true,
    },
    {
      path: "/admin-dashboard",
      element: <AdminDashboard />,
      isProtected: true,
      allowedRoles: ["ADMIN"],
    },
    {
      path: "/user-management",
      element: <UserManagement />,
      isProtected: true,
      allowedRoles: ["ADMIN"],
    },
    { path: "/reset-password", element: <ResetPassword />, isProtected: false },
  ];

  return (
    <div className="App">
      {/* Layout Components */}
      <Navbar
        setMessage={setMessage}
        setAlertType={setAlertType}
        userImage={userImage}
        setUserImage={setUserImage}
      />
      <Logout />
      <Message message={message} alertType={alertType} />

      <Routes>
        {routes.map(({ path, element, isProtected, allowedRoles }, index) => (
          <Route
            key={index}
            path={path}
            element={
              isProtected ? (
                <ProtectedRoute allowedRoles={allowedRoles}>
                  {element}
                </ProtectedRoute>
              ) : (
                element
              )
            }
          />
        ))}
      </Routes>
    </div>
  );
}

export default App;
