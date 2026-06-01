import { Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import Auth from "./pages/Auth";
import Home from "./pages/Home";
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
        </Routes>
    );
=======
import { supabase } from "./supabase";
import Auth from "./pages/Auth";
import PrivateRoute from "./components/PrivateRoute";
import { useSession } from "../hooks/useSession";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute> <h1>Home</h1></PrivateRoute>} />
      <Route path="/test" element={<h1>Test pagina</h1>} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
    </Routes>
  );

  const { session} = useSession();


  <p>{session?.email}</p>

>>>>>>> f8dd5f4b1d21724e48999afec383d7e43615d602
}