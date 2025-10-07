# 🩺 Phila MVP — React Native + Expo

A comprehensive **South African Health Management App**, built with **React Native and Expo**, that empowers patients to securely manage their medical information, appointments, and emergencies — all in one place.

> 💡 *Phila* means “to live / be healthy” in isiZulu and isiXhosa — symbolizing the mission of accessible, secure digital healthcare for everyone.

---

## 🌟 Overview

**Phila** is a health management MVP that integrates **patient identity verification**, **encrypted medical records**, **triage analysis**, and **emergency services** — built for mobile and web.
The system simulates integration with **South African Home Affairs APIs** for ID verification and provides a testable demo for public health innovation.

---

## ✨ Features

### 🔐 Authentication & Security

**Current:**

* Simulated login with ID/Passport, Surname, and Phone Number
* OTP verification (`1234` for demo)
* Simulated FaceID login
* AES encryption (CryptoJS) for patient data

**Future:**

* Secure integration with **Home Affairs API** for real ID validation
* **Biometric authentication (FaceID/Fingerprint)** across devices
* **Password strength enforcement & rainbow table protection**
* **2FA recovery flow** and brute-force detection lockouts

---

### 🏠 Home Dashboard

**Current:**

* Personalized greeting using mock patient data
* Edit quick health info (weight, allergies)
* Display upcoming appointments
* AI-based health recommendations *(placeholder)*
* Floating action button to switch demo users

**Future:**

* AI-driven health insights from medical history
* Dynamic health metrics (e.g., BMI tracking)
* Integration with **wearables (Fitbit, Apple Health)**
* In-app notifications for upcoming appointments & medications

---

### 👤 Profile Management

**Current:**

* Editable patient details
* AES-encrypted profile data
* Form validation & update feedback

**Future:**

* Medical document upload (PDF, Lab Results)
* Linked family profiles
* Verified medical history syncing from hospitals
* Multi-language support (English, isiZulu, Afrikaans, Sesotho)

---

### 📅 Appointments

**Current:**

* Book checkups or symptom-based consultations
* View appointment history
* Simple triage-based appointment prioritization
* Mock ticket/QR code generation

**Future:**

* Real-time hospital and clinic integration (via API)
* Smart scheduling (auto-reschedule when emergencies arise)
* Telehealth (video consultation integration)
* Location-based clinic recommendations

---

### 🔍 Triage System

**Current:**

* Rule-based triage assessment from symptoms
* Basic severity scoring (“low”, “medium”, “high”)
* Personalized recommendation messages

**Future:**

* ML-driven triage using patient history patterns
* Integration with health chatbots (AI symptom checker)
* Real-time hospital triage updates for medical staff

---

### 🚨 Emergency Services

**Current:**

* Large emergency call button (112 / 911)
* Mock call transcription & report generation
* Quick-access patient summary for responders

**Future:**

* **Live emergency tracking** with GPS
* Real-time medical responder coordination
* Secure digital handoff of medical records to hospitals
* Voice recognition for hands-free emergency reporting

---

## 🧰 Tech Stack

| Category          | Tools Used                            |
| ----------------- | ------------------------------------- |
| Framework         | React Native + Expo                   |
| Navigation        | Expo Router                           |
| State Management  | React Context + Hooks                 |
| Encryption        | CryptoJS (AES-256)                    |
| Database (Future) | Supabase (PostgreSQL, Auth, Realtime) |
| UI                | Custom Components + StyleSheet        |
| Type Checking     | TypeScript                            |

---

## 🗂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── InputField.tsx
│   └── OTPInput.tsx
├── screens/             # Core screens
│   ├── Login/
│   ├── Home/
│   ├── Profile/
│   ├── Appointments/
│   ├── Emergency/
│   └── Triage/
├── services/            # Business logic and API simulation
│   ├── authService.ts
│   ├── appointmentService.ts
│   ├── triageService.ts
│   └── mockUsers.ts
├── context/             # Global context providers
│   └── AuthContext.tsx
├── utils/               # Utility functions
│   ├── encryption.ts
│   ├── validation.ts
│   └── randomUser.ts
└── hooks/               # Custom hooks
    └── useAuth.ts
```

---

## 🚀 Future Roadmap

| Phase      | Feature                      | Description                                      |
| ---------- | ---------------------------- | ------------------------------------------------ |
| 🔹 Phase 1 | Supabase Integration         | Store and fetch patient data securely from cloud |
| 🔹 Phase 2 | Home Affairs API             | Real South African ID verification               |
| 🔹 Phase 3 | AI Triage Engine             | ML model for symptom evaluation                  |
| 🔹 Phase 4 | Doctor Portal                | Separate web app for medical staff access        |
| 🔹 Phase 5 | Offline Mode                 | Local encrypted data sync for rural areas        |
| 🔹 Phase 6 | Telemedicine                 | In-app video consultations                       |
| 🔹 Phase 7 | Government / NGO Integration | Pilot-ready system for public health deployment  |

---

## 🧪 Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the project**

   ```bash
   npm run web
   # or
   npm run android
   # or
   npm run ios
   ```

3. **Demo login**

   * ID: Any
   * Surname: Any
   * Phone: Any
   * OTP: `1234`

---

## 🎨 Color Scheme

| Element    | Color     |
| ---------- | --------- |
| Background | `#F9F9F9` |
| Text       | `#212121` |
| Primary    | `#2979FF` |
| Secondary  | `#FF4081` |
| Accent     | `#64FFDA` |
| Card       | `#FFFFFF` |
| Highlight  | `#FFD54F` |

---

## ⚠️ Disclaimer

This MVP is a **prototype** and does **not connect to live health systems or emergency services**.
All data is **mocked or encrypted** for demonstration purposes only.

---
