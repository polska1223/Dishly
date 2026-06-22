import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import UploadPost from "./pages/UploadPost";
import LeftoverFinder from "./pages/LeftoverFinder";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
    return (
        <Routes>

            {/* Beveiligde pagina's: alleen voor ingelogde gebruikers */}
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />

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

            <Route
                path="/leftover"
                element={
                    <PrivateRoute>
                        <LeftoverFinder />
                    </PrivateRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }
            />

            <Route
                path="/profile/:id"
                element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }
            />

            {/* Auth: bereikbaar voor inloggen/registreren, maar geen zichtbare pagina */}
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />

        </Routes>
    );
}