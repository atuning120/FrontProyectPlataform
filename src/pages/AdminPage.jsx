import { useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/HeaderAdmin";
import Footer from "../components/Footer";
import DashboardAdmin from "../components/Admin/DashboardAdmin";
import PatientList from "../components/Patients/PatientList";
import ClinicalRecordList from "../components/ClinicalRecords/ClinicalRecordList";
import AnsweredClinicalRecordList from "../components/AnsweredClinicalRecords/AnsweredClinicalRecordList";
import { AdminViewProvider, useAdminView } from "../context/AdminViewContext";

function AdminContent() {
  const {
    showDashboard,
    showPatientList,
    showClinicalRecords,
    showAnsweredRecords
  } = useAdminView();

  return (
    <main className="flex-1 px-4 pt-20 max-w-6xl w-full mx-auto">
      <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/40 p-6 space-y-8">
        {/*  Secciones dinámicas */}
        {showDashboard && <DashboardAdmin />}

        {showPatientList && (
          <div className="border-t border-white/30 pt-6">
            <PatientList />
          </div>
        )}

        {showClinicalRecords && (
          <div className="border-t border-white/30 pt-6">
            <ClinicalRecordList onResponseSubmitted={() => {}} />
          </div>
        )}

        {showAnsweredRecords && (
          <div className="border-t border-white/30 pt-6">
            <AnsweredClinicalRecordList />
          </div>
        )}
      </div>
    </main>
  );
}

export default function AdminPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <AdminViewProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-950 to-blue-900">
        <Header />
        <AdminContent />
        <Footer />
      </div>
    </AdminViewProvider>
  );
}
