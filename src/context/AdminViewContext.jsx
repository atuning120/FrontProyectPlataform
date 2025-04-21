import { createContext, useContext, useState } from "react";

const AdminViewContext = createContext();

export const AdminViewProvider = ({ children }) => {
  const [showDashboard, setShowDashboard] = useState(true);
  const [showPatientList, setShowPatientList] = useState(false);
  const [showClinicalRecords, setShowClinicalRecords] = useState(false);
  const [showAnsweredRecords, setShowAnsweredRecords] = useState(false);

  return (
    <AdminViewContext.Provider
      value={{
        showDashboard,
        setShowDashboard,
        showPatientList,
        setShowPatientList,
        showClinicalRecords,
        setShowClinicalRecords,
        showAnsweredRecords,
        setShowAnsweredRecords,
      }}
    >
      {children}
    </AdminViewContext.Provider>
  );
};

export const useAdminView = () => {
  const context = useContext(AdminViewContext);
  if (!context) {
    throw new Error("useAdminView debe usarse dentro de un AdminViewProvider");
  }
  return context;
};
