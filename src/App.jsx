import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/Auth/AuthProvider";
import Login from "./pages/Login";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import "./index.css"; //habilitar o desabilitar tailwind
import { StudentViewProvider } from "./context/StudentViewContext";
import { TeacherViewProvider } from "./context/TeacherViewContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/teacher" element={
            <TeacherViewProvider>
              <TeacherPage />
            </TeacherViewProvider>
          } />
          <Route path="/student" element={
            <StudentViewProvider>
              <StudentPage />
            </StudentViewProvider>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
