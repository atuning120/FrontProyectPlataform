import { useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import ClinicalRecordList from "../components/ClinicalRecords/ClinicalRecordList";
import AnsweredClinicalRecordList from "../components/AnsweredClinicalRecords/AnsweredClinicalRecordList";
import HeaderStudent from "../components/HeaderStudent";
import Footer from "../components/Footer";
import { useStudentView } from "../context/StudentViewContext"; // 👈 contexto

export default function StudentPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    showClinicalRecords,
    setShowClinicalRecords,
    showAnsweredRecords,
  } = useStudentView();

  useEffect(() => {
    if (!user || user.role !== "alumno") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "alumno") return null;

  const handleResponseSubmitted = () => {
    setShowClinicalRecords(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-950 to-blue-900">
      <HeaderStudent />

      <main className="flex-1 pt-20 max-w-5xl w-full mx-auto">
        <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/40 p-6">
          <div className="space-y-6">
            {showClinicalRecords && (
              <ClinicalRecordList onResponseSubmitted={handleResponseSubmitted} />
            )}
            {showAnsweredRecords && <AnsweredClinicalRecordList />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
