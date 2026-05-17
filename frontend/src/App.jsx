import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DailyReturn from "./pages/DailyReturn";
import ReturnHistory from "./pages/ReturnHistory";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/daily-return"
          element={<DailyReturn />}
        />

        <Route
          path="/return-history"
          element={<ReturnHistory />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;