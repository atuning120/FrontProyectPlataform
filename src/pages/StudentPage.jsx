import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import ClinicalRecordList from "../components/ClinicalRecords/ClinicalRecordList";
import AnsweredClinicalRecordList from "../components/AnsweredClinicalRecords/AnsweredClinicalRecordList";
import HeaderStudent from "../components/HeaderStudent";
import Footer from "../components/Footer";
import { useStudentView } from "../context/StudentViewContext"; 
import Notification from "../components/Notification";

export default function StudentPage() {
  const [notification, setNotification] = useState({ message: "", type: "success" });
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
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, message: "" })}
      />

      <main className="flex-1 pt-20 max-w-5xl w-full mx-auto">
        <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/40 p-6">
          <div className="space-y-6">
            {showClinicalRecords && (
              <ClinicalRecordList
                onResponseSubmitted={handleResponseSubmitted}
                setNotification={setNotification}
                usePagination={true}
                itemsPerPage={10}
              />
            )}
            
            {showAnsweredRecords && (
              <AnsweredClinicalRecordList 
                usePagination={true}
                itemsPerPage={10}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
