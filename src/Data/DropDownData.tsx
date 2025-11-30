const BloodGroups=new Map<string, string>([
  ["A_POSITIVE", "A+"],
  ["A_NEGATIVE", "A-"],
  ["B_POSITIVE", "B+"],
  ["B_NEGATIVE", "B-"],
  ["AB_POSITIVE", "AB+"],
  ["AB_NEGATIVE", "AB-"],
  ["O_POSITIVE", "O+"],
  ["O_NEGATIVE", "O-"],
]);

const doctorSpecializations=["Cardiologist","Neurologist","Dermatologist","Orthopedist","Pediatrician","Gynecologist"];

const doctorDeparments=["Cardiology","Neurology","Dermatology","Orthopedics","Pediatrics","Gynecology"];

const visitReasons = [
  "Fever and headache",
  "Routine check-up",
  "Follow-up consultation",
  "Cough and cold",
  "Chest pain",
  "Stomach ache",
  "Back pain",
  "Skin allergy",
  "Blood pressure check",
  "Diabetes management",
  "Prescription renewal",
  "Annual physical exam",
  "Eye irritation",
  "Joint pain",
  "Fatigue and weakness",
  "Sore throat",
  "Minor injury",
  "Flu symptoms",
  "Post-surgery review",
  "Vaccination"
];

const symptoms=[
  "Vomiting",
  "Nausea",
  "Diarrhea",
  "Headache",
  "Cough",
  "Fever",
  "Chills",
  "Sore throat",
  "Runny nose",
  "Nasal congestion",
  "Sneezing",
  "Itchy eyes",
  "Itchy mouth",
  "Itchy skin",
  "Abdominal Pain",
  "Joint Pain",
  "Muscle Pain",
  "Back Pain",
]

const tests=[
  "Blood Test",
  "X-Ray",
  "MRI",
  "CT Scan",
  "Ultrasound",
  "ECG",
  "Blood Pressure",
  "Blood Sugar",
  "Urine Test",
  "Stool Test",
  "Throat Test",
  "Malaria Test",
  "Covid Test",
  "Pregnancy Test",
]

const dosageFrequency=[
  "1-0-0",
  "0-1-0",
  "0-0-1",
  "1-1-0",
  "1-0-1",
  "0-1-1",
  "1-1-1",
]

const medicineCategories = [
  { label: "Antibiotic", value: "ANTIBIOTIC" },
  { label: "Analgesic", value: "ANALGESIC" },
  { label: "Antihistamine", value: "ANTIHISTAMINE" },
  { label: "Antiseptic", value: "ANTISEPTIC" },
  { label: "Vitamin", value: "VITAMIN" },
  { label: "Mineral", value: "MINERAL" },
  { label: "Herbal", value: "HERBAL" },
  { label: "Homeopathic", value: "HOMEOPATHIC" },
  { label: "Other", value: "OTHER" },
];


const medicineForms = [
  { label: "Syrup", value: "SYRUP" },
  { label: "Tablet", value: "TABLET" },
  { label: "Capsule", value: "CAPSULE" },
  { label: "Injection", value: "INJECTION" },
  { label: "Ointment", value: "OINTMENT" },
  { label: "Liquid", value: "LIQUID" },
  { label: "Powder", value: "POWDER" },
  { label: "Cream", value: "CREAM" },
  { label: "Spray", value: "SPRAY" },
  { label: "Drops", value: "DROPS" },
];

// eslint-disable-next-line react-refresh/only-export-components
export { BloodGroups,doctorSpecializations,doctorDeparments,visitReasons,symptoms,tests,dosageFrequency,medicineCategories,medicineForms };