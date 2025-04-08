import { createContext, useContext, useState } from "react";

const StudentViewContext = createContext();

export const StudentViewProvider = ({ children }) => {
  const [showClinicalRecords, setShowClinicalRecords] = useState(false);
  const [showAnsweredRecords, setShowAnsweredRecords] = useState(false);

  return (
    <StudentViewContext.Provider
      value={{
        showClinicalRecords,
        setShowClinicalRecords,
        showAnsweredRecords,
        setShowAnsweredRecords,
      }}
    >
      {children}
    </StudentViewContext.Provider>
  );
};

export const useStudentView = () => useContext(StudentViewContext);
