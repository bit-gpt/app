import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [isDockerAvailable, setIsDockerAvailable] = useState(false);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <Router>
      {isDockerAvailable ? (
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/chat" element={<Chat/>} />
        </Routes>
      ) : (
        <div className="container">
          <h1>This screen will show up only if docker is not available.</h1>
          <div className="row">
            <button onClick={(e) => setIsDockerAvailable(true)}>
              Download Docker.
            </button>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
