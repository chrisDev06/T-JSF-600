import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Chat from "./components/Chat";
import Home from "./components/Home";
import CreateChat from "./components/CreateChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/CreateChat" element={<CreateChat />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
