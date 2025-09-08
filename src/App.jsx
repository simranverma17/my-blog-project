import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function App() {
  const location = useLocation();

  
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
