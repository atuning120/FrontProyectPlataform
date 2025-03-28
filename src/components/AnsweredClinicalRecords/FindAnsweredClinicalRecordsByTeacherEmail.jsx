import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FindAnsweredClinicalRecordByTeacherEmail = ({ teacherEmail, onAnswered }) => {
  const [answeredRecords, setAnsweredRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (teacherEmail) {
      const fetchAnsweredRecords = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/answered-clinical-records/teacher/${teacherEmail}`);
          setAnsweredRecords(response.data);
          onAnswered(response.data); // Pasamos los registros respondidos al padre
        } catch (err) {
          setError('Error al cargar los registros');
        }
      };

      fetchAnsweredRecords();
    }
  }, [teacherEmail, onAnswered]);

  if (error) return <div>{error}</div>;

  return null;
};

export default FindAnsweredClinicalRecordByTeacherEmail;
