import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Form from "./modules/Form";
import Dashboard from "./modules/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#e1edff] h-screen flex justify-center items-center">
        {/* <Form /> */}
        <Dashboard />
      </div>
    </BrowserRouter>

  );
}

export default App;
