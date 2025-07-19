import { useState, useContext, useEffect } from "react";
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
import Notification from "../components/Notification";
import ConfirmDialog from "../components/ConfirmDialog";

export default function TeacherPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const [confirm, setConfirm] = useState({ open: false, message: "", onConfirm: () => {} });

  const pedirConfirmacion = (message, onConfirm) => {
    setConfirm({
      open: true,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirm((c) => ({ ...c, open: false }));
      },
    });
  };

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
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-950 to-blue-900">
      <Header />
      <ConfirmDialog
        open={confirm.open}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={() => setConfirm((c) => ({ ...c, open: false }))}
      />
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, message: "" })}
      />
      <main className="flex-1 pt-20 max-w-5xl w-full mx-auto">
        <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/40 p-6">
          <div className="space-y-6">
            {showForm && (
              <CreatePatient 
                onClose={() => setShowForm(false)} 
                setNotification={setNotification} 
              />
            )}
            
            {showPatientList && (
              <PatientList 
                setNotification={setNotification} 
                pedirConfirmacion={pedirConfirmacion}
                usePagination={true}
                itemsPerPage={15}
              />
            )}
            
            {showClinicRecordForm && (
              <CreateClinicalRecord 
                onClose={() => setShowClinicRecordForm(false)} 
                setNotification={setNotification} 
              />
            )}
            
            {showClinicalRecords && (
              <ClinicalRecordList 
                setNotification={setNotification} 
                pedirConfirmacion={pedirConfirmacion}
                usePagination={true}
                itemsPerPage={8}
              />
            )}
            
            {showAnsweredRecords && (
              <AnsweredClinicalRecordList 
                onFeedbackSaved={handleCloseAnsweredRecords} 
                setNotification={setNotification}
                usePagination={true}
                itemsPerPage={8}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
