import { Link, Route } from "react-router-dom";


function Dashboard() {
  return (
    <div className="container">
        <h1>Prem.AI</h1>
        <h2>Your AGI in your Pocket.</h2>
        
        <Link to="/chat">
            <button>Prem Chat</button>
        </Link>
    </div>
  );
}

export default Dashboard;
