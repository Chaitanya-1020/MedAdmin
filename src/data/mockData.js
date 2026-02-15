// ─── USERS ───────────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  { id: "D001", name: "Dr. Priya Mehta",    email: "priya@hospital.com",  password: "doctor123",  role: "doctor", status: "active", ward: "Cardiology" },
  { id: "D002", name: "Dr. Rahul Sharma",   email: "rahul@hospital.com",  password: "doctor123",  role: "doctor", status: "active", ward: "Neurology" },
  { id: "N001", name: "Nurse Anjali Singh", email: "anjali@hospital.com", password: "nurse123",   role: "nurse",  status: "active", ward: "Ward A" },
  { id: "N002", name: "Nurse Deepak Roy",   email: "deepak@hospital.com", password: "nurse123",   role: "nurse",  status: "active", ward: "Ward B" },
  { id: "A001", name: "Admin Kumar",        email: "admin@hospital.com",  password: "admin123",   role: "admin",  status: "active", ward: "All" },
];

// ─── PATIENTS ─────────────────────────────────────────────────────────────────
export const MOCK_PATIENTS = [
  { id:"P001", uniqueCode:"MR-2024-001", name:"Ramesh Gupta",  age:67, gender:"Male",   bed:"A-101", ward:"Ward A", contact:"9876543210", emergencyContact:"9876543211", admissionDate:"2025-02-10", dischargeDate:null, status:"Admitted", doctorId:"D001", condition:"Hypertension" },
  { id:"P002", uniqueCode:"MR-2024-002", name:"Sunita Devi",   age:45, gender:"Female", bed:"A-102", ward:"Ward A", contact:"9123456789", emergencyContact:"9123456780", admissionDate:"2025-02-12", dischargeDate:null, status:"Admitted", doctorId:"D001", condition:"Diabetes Type II" },
  { id:"P003", uniqueCode:"MR-2024-003", name:"Vijay Kumar",   age:54, gender:"Male",   bed:"B-201", ward:"Ward B", contact:"9988776655", emergencyContact:"9988776644", admissionDate:"2025-02-13", dischargeDate:null, status:"Admitted", doctorId:"D002", condition:"Stroke Recovery" },
  { id:"P004", uniqueCode:"MR-2024-004", name:"Meena Joshi",   age:38, gender:"Female", bed:"B-202", ward:"Ward B", contact:"9112233445", emergencyContact:"9112233446", admissionDate:"2025-02-08", dischargeDate:"2025-02-15", status:"Discharged", doctorId:"D002", condition:"Appendicitis" },
];

// ─── PRESCRIPTIONS ────────────────────────────────────────────────────────────
export const MOCK_PRESCRIPTIONS = [
  { id:"RX001", patientId:"P001", doctorId:"D001", medicineName:"Amlodipine",      dosage:"5mg",      route:"Oral",      frequency:1, times:["08:00"],             startDate:"2025-02-10", endDate:"2025-02-20", instructions:"Take with food",          status:"Active" },
  { id:"RX002", patientId:"P001", doctorId:"D001", medicineName:"Atorvastatin",    dosage:"10mg",     route:"Oral",      frequency:1, times:["22:00"],             startDate:"2025-02-10", endDate:"2025-02-20", instructions:"Take at night",           status:"Active" },
  { id:"RX003", patientId:"P002", doctorId:"D001", medicineName:"Metformin",       dosage:"500mg",    route:"Oral",      frequency:2, times:["08:00","20:00"],     startDate:"2025-02-12", endDate:"2025-02-22", instructions:"Take after meals",        status:"Active" },
  { id:"RX004", patientId:"P002", doctorId:"D001", medicineName:"Insulin Glargine",dosage:"20 units", route:"Injection", frequency:1, times:["22:00"],             startDate:"2025-02-12", endDate:"2025-02-22", instructions:"Subcutaneous injection",  status:"Active" },
  { id:"RX005", patientId:"P003", doctorId:"D002", medicineName:"Aspirin",         dosage:"75mg",     route:"Oral",      frequency:1, times:["08:00"],             startDate:"2025-02-13", endDate:"2025-02-23", instructions:"After breakfast",         status:"Active" },
  { id:"RX006", patientId:"P003", doctorId:"D002", medicineName:"Heparin",         dosage:"5000 units",route:"IV",       frequency:3, times:["06:00","14:00","22:00"],startDate:"2025-02-13", endDate:"2025-02-18", instructions:"IV infusion over 4 hours",status:"Active" },
];

// ─── TODAY'S SCHEDULE ─────────────────────────────────────────────────────────
export const TODAY_SCHEDULE = [
  { id:"SCH001", prescriptionId:"RX001", patientId:"P001", patientName:"Ramesh Gupta", bed:"A-101", ward:"Ward A", medicineName:"Amlodipine",       dosage:"5mg",       route:"Oral",      scheduledTime:"08:00", status:"Given" },
  { id:"SCH002", prescriptionId:"RX002", patientId:"P001", patientName:"Ramesh Gupta", bed:"A-101", ward:"Ward A", medicineName:"Atorvastatin",     dosage:"10mg",      route:"Oral",      scheduledTime:"22:00", status:"Missed" },
  { id:"SCH003", prescriptionId:"RX003", patientId:"P002", patientName:"Sunita Devi",  bed:"A-102", ward:"Ward A", medicineName:"Metformin",        dosage:"500mg",     route:"Oral",      scheduledTime:"08:00", status:"Delayed" },
  { id:"SCH004", prescriptionId:"RX003", patientId:"P002", patientName:"Sunita Devi",  bed:"A-102", ward:"Ward A", medicineName:"Metformin",        dosage:"500mg",     route:"Oral",      scheduledTime:"20:00", status:"Pending" },
  { id:"SCH005", prescriptionId:"RX004", patientId:"P002", patientName:"Sunita Devi",  bed:"A-102", ward:"Ward A", medicineName:"Insulin Glargine", dosage:"20 units",  route:"Injection", scheduledTime:"22:00", status:"Pending" },
  { id:"SCH006", prescriptionId:"RX005", patientId:"P003", patientName:"Vijay Kumar",  bed:"B-201", ward:"Ward B", medicineName:"Aspirin",          dosage:"75mg",      route:"Oral",      scheduledTime:"08:00", status:"Given" },
  { id:"SCH007", prescriptionId:"RX006", patientId:"P003", patientName:"Vijay Kumar",  bed:"B-201", ward:"Ward B", medicineName:"Heparin",          dosage:"5000 units",route:"IV",        scheduledTime:"06:00", status:"Given" },
  { id:"SCH008", prescriptionId:"RX006", patientId:"P003", patientName:"Vijay Kumar",  bed:"B-201", ward:"Ward B", medicineName:"Heparin",          dosage:"5000 units",route:"IV",        scheduledTime:"14:00", status:"Pending" },
  { id:"SCH009", prescriptionId:"RX006", patientId:"P003", patientName:"Vijay Kumar",  bed:"B-201", ward:"Ward B", medicineName:"Heparin",          dosage:"5000 units",route:"IV",        scheduledTime:"22:00", status:"Pending" },
];

// ─── LOGS ─────────────────────────────────────────────────────────────────────
export const MOCK_LOGS = [
  { id:"L001", prescriptionId:"RX001", scheduleId:"SCH001", patientId:"P001", nurseId:"N001", nurseName:"Nurse Anjali Singh", givenTime:"08:05", scheduledTime:"08:00", date:"2025-02-14", status:"Given",   remarks:"" },
  { id:"L002", prescriptionId:"RX002", scheduleId:"SCH002", patientId:"P001", nurseId:"N001", nurseName:"Nurse Anjali Singh", givenTime:null,    scheduledTime:"22:00", date:"2025-02-14", status:"Missed",  remarks:"Patient refused" },
  { id:"L003", prescriptionId:"RX003", scheduleId:"SCH003", patientId:"P002", nurseId:"N001", nurseName:"Nurse Anjali Singh", givenTime:"08:15", scheduledTime:"08:00", date:"2025-02-14", status:"Delayed", remarks:"Patient was in procedure" },
  { id:"L004", prescriptionId:"RX005", scheduleId:"SCH006", patientId:"P003", nurseId:"N002", nurseName:"Nurse Deepak Roy",   givenTime:"08:02", scheduledTime:"08:00", date:"2025-02-14", status:"Given",   remarks:"" },
];
