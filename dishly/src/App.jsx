import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Explore from "./pages/Explore";

export default function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />
            <Route path="/Explore" element={<Explore/>} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />
        </Routes>
    );
}