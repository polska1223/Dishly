import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import UploadPost from "./pages/UploadPost";
import PrivateRoute from "./components/PrivateRoute";

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

            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />

            <Route
                path="/explore"
                element={
                    <PrivateRoute>
                        <Explore />
                    </PrivateRoute>
                }
            />

            <Route
                path="/upload"
                element={
                    <PrivateRoute>
                        <UploadPost />
                    </PrivateRoute>
                }
            />

            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
    );
}