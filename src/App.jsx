import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/Auth/AuthProvider";
import Login from "./pages/Login";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
//import "./index.css"; //habilitar o desabilitar tailwind


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/student" element={<StudentPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
