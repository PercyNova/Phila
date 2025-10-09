import { createClient } from "@supabase/supabase-js";
import { encryptAES } from "../src/utils/encryption.js";
import CryptoJS from "crypto-js";

// --- Supabase Connection ---
const supabase = createClient(
  "https://YOUR_PROJECT_URL.supabase.co",
  "YOUR_SUPABASE_SERVICE_KEY"
);

// --- Demo Users ---
const demoUsers = [
  {
    user_id: encryptAES("user001"),
    surname: encryptAES("Mokoena"),
    first_name: encryptAES("Thabo Samuel"),
    date_of_birth: "1994-03-21",
    phone: encryptAES("+27834567890"),
    email: encryptAES("thabo.mokoena@example.com"),
    address: encryptAES("123 Madiba St, Pretoria"),
    weight: encryptAES("74"),
    height: encryptAES("178"),
    blood_type: encryptAES("B+"),
    allergies: encryptAES("Penicillin"),
    emergency_contact_name: encryptAES("Lerato Mokoena"),
    emergency_contact_phone: encryptAES("+27831234567"),
    emergency_contact_email: encryptAES("lerato@example.com"),
  },
  {
    user_id: encryptAES("user002"),
    surname: encryptAES("Naidoo"),
    first_name: encryptAES("Priya"),
    date_of_birth: "1989-11-09",
    phone: encryptAES("+27821009876"),
    email: encryptAES("priya.naidoo@example.com"),
    address: encryptAES("45 Florida Rd, Durban"),
    weight: encryptAES("62"),
    height: encryptAES("165"),
    blood_type: encryptAES("O+"),
    allergies: encryptAES("None"),
    emergency_contact_name: encryptAES("Rajesh Naidoo"),
    emergency_contact_phone: encryptAES("+27825559999"),
    emergency_contact_email: encryptAES("rajesh@example.com"),
  },
  {
    user_id: encryptAES("user003"),
    surname: encryptAES("van der Merwe"),
    first_name: encryptAES("Pieter"),
    date_of_birth: "1978-06-02",
    phone: encryptAES("+27835556666"),
    email: encryptAES("pieter.vdm@example.com"),
    address: encryptAES("89 Bree St, Cape Town"),
    weight: encryptAES("85"),
    height: encryptAES("182"),
    blood_type: encryptAES("A-"),
    allergies: encryptAES("Dust"),
    emergency_contact_name: encryptAES("Annelie van der Merwe"),
    emergency_contact_phone: encryptAES("+27836667777"),
    emergency_contact_email: encryptAES("annelie@example.com"),
  },
];

async function seedDatabase() {
  console.log("Seeding profiles...");

  for (const user of demoUsers) {
    const { data, error } = await supabase.from("profiles").insert(user);
    if (error) console.error("❌ Error inserting:", error);
    else console.log("✅ Inserted:", data);
  }

  console.log("Done seeding!");
}

seedDatabase();
