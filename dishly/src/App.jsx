import { Routes, Route } from "react-router-dom";
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

}