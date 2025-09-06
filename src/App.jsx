import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
