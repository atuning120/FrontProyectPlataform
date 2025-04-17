import { createContext, useContext, useState } from "react";

const TeacherViewContext = createContext();

export const TeacherViewProvider = ({ children }) => {
  const [showForm, setShowForm] = useState(false);
  const [showPatientList, setShowPatientList] = useState(false);
  const [showClinicRecordForm, setShowClinicRecordForm] = useState(false);
  const [showClinicalRecords, setShowClinicalRecords] = useState(false);
  const [showAnsweredRecords, setShowAnsweredRecords] = useState(false);

  return (
    <TeacherViewContext.Provider
      value={{
        showForm,
        setShowForm,
        showPatientList,
        setShowPatientList,
        showClinicRecordForm,
        setShowClinicRecordForm,
        showClinicalRecords,
        setShowClinicalRecords,
        showAnsweredRecords,
        setShowAnsweredRecords,
      }}
    >
      {children}
    </TeacherViewContext.Provider>
  );
};

export const useTeacherView = () => {
  const context = useContext(TeacherViewContext);
  if (!context) {
    throw new Error("useTeacherView must be used within a TeacherViewProvider");
  }
  return context;
};
