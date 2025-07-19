import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/HeaderAdmin";
import Footer from "../components/Footer";
import DashboardAdmin from "../components/Admin/DashboardAdmin";
import PatientList from "../components/Patients/PatientList";
import ClinicalRecordList from "../components/ClinicalRecords/ClinicalRecordList";
import AnsweredClinicalRecordList from "../components/AnsweredClinicalRecords/AnsweredClinicalRecordList";
import { AdminViewProvider, useAdminView } from "../context/AdminViewContext";
import Notification from "../components/Notification";
import ConfirmDialog from "../components/ConfirmDialog";

function AdminContent() {
  const {
    showDashboard,
    showPatientList,
    showClinicalRecords,
    showAnsweredRecords
  } = useAdminView();

  const { setNotification, pedirConfirmacion } = useAdminPageContext();

  return (
    <main className="flex-1 px-4 pt-20 max-w-6xl w-full mx-auto">
      <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/40 p-6 space-y-8">
        {/*  Secciones dinámicas */}
        {showDashboard && <DashboardAdmin setNotification={setNotification} pedirConfirmacion={pedirConfirmacion} />}

        {showPatientList && (
          <div className="border-t border-white/30 pt-6">
            <PatientList 
              setNotification={setNotification} 
              pedirConfirmacion={pedirConfirmacion}
              usePagination={true}
              itemsPerPage={15}
            />
          </div>
        )}

        {showClinicalRecords && (
          <div className="border-t border-white/30 pt-6">
            <ClinicalRecordList 
              onResponseSubmitted={() => {}} 
              setNotification={setNotification} 
              pedirConfirmacion={pedirConfirmacion}
              usePagination={true}
              itemsPerPage={10}
            />
          </div>
        )}

        {showAnsweredRecords && (
          <div className="border-t border-white/30 pt-6">
            <AnsweredClinicalRecordList 
              setNotification={setNotification}
              usePagination={true}
              itemsPerPage={10}
            />
          </div>
        )}
      </div>
    </main>
  );
}

const AdminPageContext = createContext();
export const useAdminPageContext = () => useContext(AdminPageContext);

export default function AdminPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [confirm, setConfirm] = useState({
    open: false,
    message: "",
    onConfirm: () => {},
  });

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

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <AdminViewProvider>
      <AdminPageContext.Provider value={{ setNotification, pedirConfirmacion }}>
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-950 to-blue-900">
          <Header />
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ ...notification, message: "" })}
          />
          <ConfirmDialog
            open={confirm.open}
            message={confirm.message}
            onConfirm={confirm.onConfirm}
            onCancel={() => setConfirm((c) => ({ ...c, open: false }))}
          />
          <AdminContent />
          <Footer />
        </div>
      </AdminPageContext.Provider>
    </AdminViewProvider>
  );
}
