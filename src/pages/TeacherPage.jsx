import { useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CreatePatient from "../components/Patients/CreatePatient";
import PatientList from "../components/Patients/PatientList";
import CreateClinicalRecord from "../components/ClinicalRecords/CreateClinicalRecord";
import ClinicalRecordList from "../components/ClinicalRecords/ClinicalRecordList";
import AnsweredClinicalRecordList from "../components/AnsweredClinicalRecords/AnsweredClinicalRecordList";
import Footer from "../components/Footer";
import { useTeacherView } from "../context/TeacherViewContext";

export default function TeacherPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    showForm,
    setShowForm,
    showPatientList,
    showClinicRecordForm,
    setShowClinicRecordForm,
    showClinicalRecords,
    showAnsweredRecords,
    setShowAnsweredRecords,
  } = useTeacherView();

  useEffect(() => {
    if (!user || user.role !== "profesor") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "profesor") return null;

  const handleCloseAnsweredRecords = () => {
    setShowAnsweredRecords(false);
    alert("Retroalimentación guardada con éxito.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-950 to-blue-900">
      <Header />

      <main className="flex-1 px-4 pt-20 max-w-4xl w-full mx-auto">
        <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/40 p-6">
          <div className="space-y-6">
            {showForm && <CreatePatient onClose={() => setShowForm(false)} />}
            {showPatientList && <PatientList />}
            {showClinicRecordForm && <CreateClinicalRecord onClose={() => setShowClinicRecordForm(false)} />}
            {showClinicalRecords && <ClinicalRecordList />}
            {showAnsweredRecords && <AnsweredClinicalRecordList onFeedbackSaved={handleCloseAnsweredRecords} />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
