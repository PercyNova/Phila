

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateID = (id: string): boolean => {
  // Basic validation - at least 5 characters, alphanumeric
  const idRegex = /^[A-Za-z0-9]{5,}$/;
  return idRegex.test(id);
};

export const validateSurname = (surname: string): boolean => {
  // At least 2 characters, letters only
  const surnameRegex = /^[A-Za-z]{2,}$/;
  return surnameRegex.test(surname);
};

export const validateOTP = (otp: string): boolean => {
  // 4 digit OTP
  const otpRegex = /^\d{4}$/;
  return otpRegex.test(otp);
};

export const validateWeight = (weight: string): boolean => {
  const weightNum = parseFloat(weight);
  return !isNaN(weightNum) && weightNum > 0 && weightNum < 1000;
};

export const validateAllergies = (allergies: string): boolean => {
  // Allow empty or valid text
  return allergies.length <= 500;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

