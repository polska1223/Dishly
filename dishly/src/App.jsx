import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/test" element={<h1>Test pagina</h1>} />
    </Routes>
  );
}