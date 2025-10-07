
# HealthApp MVP - React Native + Expo

A comprehensive health management application built with React Native and Expo, featuring patient management, appointments, triage assessment, and emergency services.

## Features

### 🔐 Authentication & Security
- Simulated login with ID/Passport, Surname, and Phone Number
- OTP verification (use code: 1234)
- FaceID simulation
- AES encryption for sensitive data using CryptoJS

### 🏠 Home Dashboard
- Personalized welcome with user's name
- Quick health info editing (weight, allergies)
- Upcoming appointments display
- Health recommendations
- Demo user switching functionality

### 👤 Profile Management
- Complete profile editing with form validation
- Encrypted sensitive data storage
- Medical history and medications display
- Emergency contact management

### 📅 Appointments
- Book routine checkups or symptom-based appointments
- Integrated triage assessment
- Appointment history and management
- Mock ticket code generation

### 🔍 Triage System
- Symptom input and severity rating
- Rule-based evaluation system
- Urgency level assessment
- Personalized recommendations

### 🚨 Emergency Services
- Large emergency call button
- Quick access to emergency numbers
- Medical information summary for responders
- Mock emergency report generation

## Tech Stack

- **Framework**: React Native + Expo 54
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context + Hooks
- **Encryption**: CryptoJS for AES encryption
- **UI Components**: Custom components with TypeScript
- **Styling**: StyleSheet with consistent color scheme

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── InputField.tsx
│   └── OTPInput.tsx
├── screens/            # Screen components
│   ├── Login/
│   └── Triage/
├── services/           # Business logic and API simulation
│   ├── authService.ts
│   ├── appointmentService.ts
│   ├── triageService.ts
│   └── mockUsers.ts
├── context/            # React Context providers
│   └── AuthContext.tsx
├── utils/              # Utility functions
│   ├── encryption.ts
│   ├── validation.ts
│   └── randomUser.ts
└── hooks/              # Custom React hooks
    └── useAuth.ts
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run web    # For web development
   npm run ios    # For iOS simulator
   npm run android # For Android emulator
   ```

3. Login with any credentials and use OTP: `1234`

## Demo Features

- **Mock Users**: Random user generation with encrypted data
- **Simulated Services**: All backend services are mocked for demo purposes
- **Cross-Platform**: Fully functional on iOS, Android, and Web
- **Responsive Design**: Optimized for different screen sizes

## Security Features

- AES encryption for sensitive patient data
- Form validation for all user inputs
- Secure authentication flow simulation
- Emergency contact encryption

## Color Scheme

- Background: `#F9F9F9` (Light Gray)
- Text: `#212121` (Dark Gray)
- Primary: `#2979FF` (Blue)
- Secondary: `#FF4081` (Pink)
- Accent: `#64FFDA` (Teal)
- Card: `#FFFFFF` (White)
- Highlight: `#FFD54F` (Yellow)

## Notes

- This is a demo application with simulated backend services
- All data is stored locally and encrypted
- Emergency services are simulated for demo purposes
- The triage system uses rule-based evaluation for demonstration
