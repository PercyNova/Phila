
import { encryptData } from './encryption';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  weight: string;
  height: string;
  bloodType: string;
  allergies: string;
  emergencyContact: string;
  medicalHistory: string[];
  medications: string[];
  lastVisit: string;
  nextAppointment?: string;
}

const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa',
  'William', 'Jennifer', 'James', 'Mary', 'Christopher', 'Patricia', 'Daniel',
  'Linda', 'Matthew', 'Elizabeth', 'Anthony', 'Barbara', 'Mark', 'Susan'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
];

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const allergies = [
  'None known',
  'Penicillin',
  'Peanuts',
  'Shellfish',
  'Latex',
  'Dust mites',
  'Pollen',
  'Pet dander',
  'Aspirin',
  'Ibuprofen'
];

const medicalConditions = [
  'Hypertension',
  'Diabetes Type 2',
  'Asthma',
  'High cholesterol',
  'Arthritis',
  'Migraine',
  'Anxiety',
  'Depression',
  'GERD',
  'Osteoporosis'
];

const medications = [
  'Lisinopril',
  'Metformin',
  'Albuterol',
  'Atorvastatin',
  'Ibuprofen',
  'Omeprazole',
  'Sertraline',
  'Levothyroxine',
  'Amlodipine',
  'Metoprolol'
];

export const generateRandomUser = (): User => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const phone = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
  
  const birthYear = 1950 + Math.floor(Math.random() * 50);
  const birthMonth = Math.floor(Math.random() * 12) + 1;
  const birthDay = Math.floor(Math.random() * 28) + 1;
  const dateOfBirth = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
  
  const weight = (50 + Math.random() * 100).toFixed(1);
  const height = (150 + Math.random() * 50).toFixed(0);
  const bloodType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
  const userAllergies = allergies[Math.floor(Math.random() * allergies.length)];
  
  const emergencyContact = `Emergency: ${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]} - +1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
  
  const userMedicalHistory = [];
  const numConditions = Math.floor(Math.random() * 3);
  for (let i = 0; i < numConditions; i++) {
    const condition = medicalConditions[Math.floor(Math.random() * medicalConditions.length)];
    if (!userMedicalHistory.includes(condition)) {
      userMedicalHistory.push(condition);
    }
  }
  
  const userMedications = [];
  const numMedications = Math.floor(Math.random() * 3);
  for (let i = 0; i < numMedications; i++) {
    const medication = medications[Math.floor(Math.random() * medications.length)];
    if (!userMedications.includes(medication)) {
      userMedications.push(medication);
    }
  }
  
  const lastVisitDate = new Date();
  lastVisitDate.setDate(lastVisitDate.getDate() - Math.floor(Math.random() * 90));
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    firstName,
    lastName,
    phone,
    email,
    dateOfBirth,
    weight,
    height,
    bloodType,
    allergies: userAllergies,
    emergencyContact,
    medicalHistory: userMedicalHistory,
    medications: userMedications,
    lastVisit: lastVisitDate.toISOString().split('T')[0],
  };
};

export const getRandomUser = (): User => {
  return generateRandomUser();
};
