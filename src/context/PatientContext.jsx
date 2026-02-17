import { createContext, useContext, useState, useEffect } from "react";

const PatientContext = createContext(null);

export function PatientProvider({ children }) {
  const [patients, setPatients] = useState([]);

  // 1. Loads all data from patients.json
  const refreshPatients = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/patients");
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error("Connection to backend failed:", err);
    }
  };

  useEffect(() => { refreshPatients(); }, []);

  // 2. Adds a new patient
  const addPatient = async (patientData) => {
    try {
      const res = await fetch('http://localhost:5000/api/patients/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      });

      const data = await res.json();
      if (data.success) {
        await refreshPatients(); 
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.error("Network Error: Is the server running on port 5000?");
      return { success: false };
    }
  };

  // 3. Updates an existing patient in patients.json
  const updatePatient = async (id, updatedData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/patients/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success) await refreshPatients();
      return data;
    } catch (err) {
      console.error("Update failed:", err);
      return { success: false };
    }
  };

  // 4. Deletes a patient from patients.json
  const deletePatient = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/patients/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) await refreshPatients();
      return data;
    } catch (err) {
      console.error("Delete failed:", err);
      return { success: false };
    }
  };




  return (
    // Make sure all 4 functions are included in the value prop
    <PatientContext.Provider value={{ patients, addPatient, updatePatient, deletePatient, refreshPatients }}>
      {children}
    </PatientContext.Provider>
  );
}

export const usePatients = () => useContext(PatientContext);


