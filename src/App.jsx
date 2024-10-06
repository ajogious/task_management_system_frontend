import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ItemList from "./components/ItemList";
import AddItem from "./components/AddItem";
import UserPage from "./components/UserPage";
import EditItem from "./components/EditItem";

function App() {
  const [username, setUsername] = useState(null);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login setUsername={setUsername} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userpage" element={<UserPage />} />
        <Route path="/tasks" element={<ItemList username={username} />} />
        <Route path="/addtask" element={<AddItem username={username} />} />
        <Route path="/update/:id" element={<EditItem username={username} />} />
      </Routes>
    </div>
  );
}

export default App;
