require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const Member = require("./models/Member");
const Membership = require("./models/Membership");
const Trainer = require("./models/Trainer");
const Attendance = require("./models/Attendance");

const members = [
  {
    memberId: "M001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    dateOfBirth: "1998-04-12",
    gender: "male",
    membershipPlan: "Premium",
    joinDate: "2026-08-26",
    status: "active",
  },
  {
    memberId: "M002",
    name: "Priya Verma",
    email: "priya.verma@example.com",
    phone: "9876500011",
    dateOfBirth: "2000-01-22",
    gender: "female",
    membershipPlan: "Basic",
    joinDate: "2026-07-10",
    status: "active",
  },
];

const memberships = [
  { planId: "PLAN-BASIC", planName: "Basic", duration: "1 month", price: 999, description: "Gym floor access", status: "active" },
  { planId: "PLAN-PREMIUM", planName: "Premium", duration: "1 month", price: 2999, description: "Unlimited classes + 1 PT session/week", status: "active" },
  { planId: "PLAN-ELITE", planName: "Elite", duration: "1 month", price: 4999, description: "Unlimited classes + 4 PT sessions/month + nutrition coaching", status: "active" },
];

const trainers = [
  { trainerId: "T001", name: "Dev Patel", email: "dev.patel@irongrid.gym", phone: "9820011111", specialization: "Strength & Conditioning", experience: 7, status: "active" },
  { trainerId: "T002", name: "Meera Iyer", email: "meera.iyer@irongrid.gym", phone: "9820022222", specialization: "Yoga & Mobility", experience: 5, status: "active" },
];

async function seed() {
  await connectDB();

  await Promise.all([
    Member.deleteMany({}),
    Membership.deleteMany({}),
    Trainer.deleteMany({}),
    Attendance.deleteMany({}),
  ]);

  const createdMembers = await Member.insertMany(members);
  await Membership.insertMany(memberships);
  await Trainer.insertMany(trainers);

  await Attendance.insertMany([
    {
      memberId: createdMembers[0].memberId,
      date: "2026-08-26",
      checkIn: "06:15",
      checkOut: "07:30",
      status: "checked_out",
    },
  ]);

  console.log("[Seed] Demo data inserted successfully.");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[Seed] Failed:", err.message);
  process.exit(1);
});
