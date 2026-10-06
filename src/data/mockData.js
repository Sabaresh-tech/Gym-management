// Mock data, shaped to mirror the Supabase tables this UI will eventually
// read from (members, membership_plans, trainers, attendance, payments,
// classes, equipment, notifications). Swap these arrays for Supabase
// queries later without touching the components.

export const BRANCH = {
  id: "branch_01",
  name: "IronGrid Fitness",
  location: "Kalyan, Maharashtra",
};

export const MEMBERSHIP_PLANS = [
  {
    id: "plan_basic",
    name: "Basic",
    price: 999,
    duration: "1 month",
    features: ["Gym floor access", "Locker access", "Free fitness assessment"],
    active_members: 210,
    status: "active",
  },
  {
    id: "plan_standard",
    name: "Standard",
    price: 1799,
    duration: "1 month",
    features: ["Gym floor access", "2 group classes/week", "Diet consultation"],
    active_members: 486,
    status: "active",
  },
  {
    id: "plan_premium",
    name: "Premium",
    price: 2999,
    duration: "1 month",
    features: ["Unlimited classes", "1 PT session/week", "Sauna access"],
    active_members: 312,
    status: "active",
  },
  {
    id: "plan_annual",
    name: "Annual",
    price: 24999,
    duration: "12 months",
    features: ["Unlimited classes", "4 PT sessions/month", "Guest passes x6"],
    active_members: 198,
    status: "active",
  },
  {
    id: "plan_student",
    name: "Student",
    price: 699,
    duration: "1 month",
    features: ["Gym floor access", "Off-peak hours only"],
    active_members: 78,
    status: "active",
  },
];

export const MEMBERS = [
  { id: "MEM-1042", name: "Aarav Mehta", email: "aarav.mehta@mail.com", phone: "+91 98200 11234", plan: "Annual", status: "active", joined: "2024-01-12", expiry: "2027-01-12", payment_status: "paid" },
  { id: "MEM-1043", name: "Priya Nair", email: "priya.nair@mail.com", phone: "+91 98200 22345", plan: "Standard", status: "pending", joined: "2025-06-03", expiry: "2026-08-20", payment_status: "pending" },
  { id: "MEM-1044", name: "Karan Malhotra", email: "karan.m@mail.com", phone: "+91 98200 33456", plan: "Annual", status: "active", joined: "2023-11-22", expiry: "2026-11-22", payment_status: "paid" },
  { id: "MEM-1045", name: "Sneha Kulkarni", email: "sneha.k@mail.com", phone: "+91 98200 44567", plan: "Student", status: "active", joined: "2026-02-14", expiry: "2026-09-14", payment_status: "paid" },
  { id: "MEM-1046", name: "Vikram Rao", email: "vikram.rao@mail.com", phone: "+91 98200 55678", plan: "Standard", status: "suspended", joined: "2025-07-30", expiry: "2026-08-30", payment_status: "overdue" },
  { id: "MEM-1047", name: "Ishita Bose", email: "ishita.bose@mail.com", phone: "+91 98200 66789", plan: "Premium", status: "pending", joined: "2024-09-09", expiry: "2026-08-25", payment_status: "pending" },
  { id: "MEM-1048", name: "Rohan Kapoor", email: "rohan.kapoor@mail.com", phone: "+91 98200 77890", plan: "Standard", status: "active", joined: "2026-04-18", expiry: "2026-10-18", payment_status: "paid" },
  { id: "MEM-1049", name: "Ananya Joshi", email: "ananya.joshi@mail.com", phone: "+91 98200 88901", plan: "Student", status: "active", joined: "2026-08-01", expiry: "2027-02-01", payment_status: "paid" },
  { id: "MEM-1050", name: "Devansh Shah", email: "devansh.shah@mail.com", phone: "+91 98200 99012", plan: "Premium", status: "expired", joined: "2024-03-05", expiry: "2026-07-05", payment_status: "overdue" },
  { id: "MEM-1051", name: "Meera Iyer", email: "meera.iyer@mail.com", phone: "+91 98200 10123", plan: "Annual", status: "active", joined: "2023-05-19", expiry: "2026-05-19", payment_status: "paid" },
  { id: "MEM-1052", name: "Yash Trivedi", email: "yash.trivedi@mail.com", phone: "+91 98200 21234", plan: "Basic", status: "active", joined: "2026-07-22", expiry: "2026-08-22", payment_status: "paid" },
  { id: "MEM-1053", name: "Nikita Deshmukh", email: "nikita.d@mail.com", phone: "+91 98200 32345", plan: "Basic", status: "expired", joined: "2026-01-08", expiry: "2026-02-08", payment_status: "overdue" },
];

export const TRAINERS = [
  { id: "TRN-01", name: "Dev Patel", specialization: "Strength & Conditioning", experience: "7 yrs", assigned_members: 34, rating: 4.8, availability: "Mon–Sat, 6am–2pm" },
  { id: "TRN-02", name: "Ravi Shah", specialization: "Powerlifting", experience: "9 yrs", assigned_members: 28, rating: 4.9, availability: "Mon–Fri, 8am–6pm" },
  { id: "TRN-03", name: "Meera Iyer", specialization: "Yoga & Mobility", experience: "5 yrs", assigned_members: 41, rating: 4.7, availability: "Tue–Sun, 7am–1pm" },
  { id: "TRN-04", name: "Nina Fernandes", specialization: "Boxing & HIIT", experience: "6 yrs", assigned_members: 22, rating: 4.6, availability: "Mon–Sat, 4pm–9pm" },
  { id: "TRN-05", name: "Arjun Bhatt", specialization: "CrossFit", experience: "4 yrs", assigned_members: 19, rating: 4.5, availability: "Wed–Mon, 6am–12pm" },
];

export const CLASSES = [
  { id: "CLS-01", name: "Sunrise HIIT", trainer: "Dev Patel", date: "2026-08-15", time: "06:00", capacity: 20, enrolled: 18, status: "scheduled" },
  { id: "CLS-02", name: "Powerlifting 101", trainer: "Ravi Shah", date: "2026-08-15", time: "07:30", capacity: 12, enrolled: 12, status: "full" },
  { id: "CLS-03", name: "Vinyasa Flow", trainer: "Meera Iyer", date: "2026-08-15", time: "09:00", capacity: 15, enrolled: 9, status: "scheduled" },
  { id: "CLS-04", name: "Lunch Circuit", trainer: "Dev Patel", date: "2026-08-15", time: "12:00", capacity: 20, enrolled: 20, status: "full" },
  { id: "CLS-05", name: "Strength & Core", trainer: "Ravi Shah", date: "2026-08-15", time: "17:30", capacity: 18, enrolled: 14, status: "scheduled" },
  { id: "CLS-06", name: "Boxing Fundamentals", trainer: "Nina Fernandes", date: "2026-08-15", time: "19:00", capacity: 16, enrolled: 16, status: "full" },
  { id: "CLS-07", name: "CrossFit WOD", trainer: "Arjun Bhatt", date: "2026-08-16", time: "06:30", capacity: 14, enrolled: 6, status: "scheduled" },
  { id: "CLS-08", name: "Zumba Blast", trainer: "Nina Fernandes", date: "2026-08-16", time: "18:00", capacity: 25, enrolled: 3, status: "cancelled" },
];

export const EQUIPMENT = [
  { id: "EQP-01", name: "Olympic Barbell Set", category: "Free weights", quantity: 12, condition: "good", purchased: "2023-02-10", last_maintenance: "2026-06-01" },
  { id: "EQP-02", name: "Treadmill — Life Fitness T5", category: "Cardio", quantity: 8, condition: "needs_maintenance", purchased: "2022-11-05", last_maintenance: "2026-03-15" },
  { id: "EQP-03", name: "Cable Crossover Machine", category: "Machines", quantity: 2, condition: "good", purchased: "2024-01-20", last_maintenance: "2026-07-10" },
  { id: "EQP-04", name: "Rowing Machine", category: "Cardio", quantity: 5, condition: "under_maintenance", purchased: "2023-06-18", last_maintenance: "2026-08-10" },
  { id: "EQP-05", name: "Squat Rack", category: "Free weights", quantity: 6, condition: "good", purchased: "2022-09-01", last_maintenance: "2026-05-22" },
  { id: "EQP-06", name: "Leg Press Machine", category: "Machines", quantity: 3, condition: "damaged", purchased: "2021-12-12", last_maintenance: "2026-02-01" },
];

export const PAYMENTS = [
  { id: "TXN-8841", member: "Aarav Mehta", plan: "Annual", amount: 24999, method: "Card", date: "2026-08-01", status: "paid" },
  { id: "TXN-8842", member: "Priya Nair", plan: "Standard", amount: 1799, method: "UPI", date: "2026-08-05", status: "pending" },
  { id: "TXN-8843", member: "Karan Malhotra", plan: "Annual", amount: 24999, method: "Bank Transfer", date: "2026-08-03", status: "paid" },
  { id: "TXN-8844", member: "Vikram Rao", plan: "Standard", amount: 1799, method: "Cash", date: "2026-07-30", status: "overdue" },
  { id: "TXN-8845", member: "Ishita Bose", plan: "Premium", amount: 2999, method: "UPI", date: "2026-08-08", status: "pending" },
  { id: "TXN-8846", member: "Rohan Kapoor", plan: "Standard", amount: 1799, method: "Card", date: "2026-08-10", status: "paid" },
  { id: "TXN-8847", member: "Devansh Shah", plan: "Premium", amount: 2999, method: "Cash", date: "2026-07-05", status: "overdue" },
  { id: "TXN-8848", member: "Meera Iyer", plan: "Annual", amount: 24999, method: "Bank Transfer", date: "2026-08-11", status: "paid" },
];

export const ATTENDANCE = [
  { id: "ATT-01", member: "Aarav Mehta", check_in: "06:12", check_out: "07:40", duration: "1h 28m", status: "checked_out" },
  { id: "ATT-02", member: "Priya Nair", check_in: "07:05", check_out: null, duration: "—", status: "checked_in" },
  { id: "ATT-03", member: "Karan Malhotra", check_in: "17:30", check_out: "19:00", duration: "1h 30m", status: "checked_out" },
  { id: "ATT-04", member: "Sneha Kulkarni", check_in: "09:00", check_out: null, duration: "—", status: "checked_in" },
  { id: "ATT-05", member: "Rohan Kapoor", check_in: "18:15", check_out: "19:45", duration: "1h 30m", status: "checked_out" },
  { id: "ATT-06", member: "Ananya Joshi", check_in: "06:45", check_out: "08:00", duration: "1h 15m", status: "checked_out" },
];

export const NOTIFICATIONS = [
  { id: "NTF-01", type: "expiry", title: "3 memberships expiring this week", detail: "Priya Nair, Ishita Bose and 1 other", time: "2h ago" },
  { id: "NTF-02", type: "payment", title: "Payment overdue", detail: "Vikram Rao — ₹1,799 pending since 30 Jul", time: "5h ago" },
  { id: "NTF-03", type: "member", title: "New member joined", detail: "Ananya Joshi signed up for Student plan", time: "1d ago" },
  { id: "NTF-04", type: "attendance", title: "Low attendance alert", detail: "Sunday attendance down 18% vs average", time: "1d ago" },
  { id: "NTF-05", type: "equipment", title: "Maintenance due", detail: "Treadmill (Life Fitness T5) — service overdue", time: "2d ago" },
];

export const REVENUE_BY_MONTH = [
  { month: "Mar", revenue: 38200 },
  { month: "Apr", revenue: 41500 },
  { month: "May", revenue: 43800 },
  { month: "Jun", revenue: 45100 },
  { month: "Jul", revenue: 47300 },
  { month: "Aug", revenue: 48960 },
];

export const MEMBERSHIP_TRENDS = [
  { month: "Mar", new: 42, renewals: 65, expired: 18 },
  { month: "Apr", new: 51, renewals: 70, expired: 22 },
  { month: "May", new: 38, renewals: 74, expired: 15 },
  { month: "Jun", new: 60, renewals: 68, expired: 20 },
  { month: "Jul", new: 55, renewals: 80, expired: 17 },
  { month: "Aug", new: 47, renewals: 77, expired: 24 },
];

export const REVENUE_BY_PLAN = [
  { name: "Basic", value: 8990 },
  { name: "Standard", value: 15200 },
  { name: "Premium", value: 12600 },
  { name: "Annual", value: 9800 },
  { name: "Student", value: 2370 },
];

export const REVENUE_BY_METHOD = [
  { name: "Card", value: 42 },
  { name: "UPI", value: 31 },
  { name: "Cash", value: 18 },
  { name: "Bank Transfer", value: 9 },
];

export const ATTENDANCE_WEEKLY = [
  { day: "Mon", visits: 168 },
  { day: "Tue", visits: 190 },
  { day: "Wed", visits: 205 },
  { day: "Thu", visits: 178 },
  { day: "Fri", visits: 224 },
  { day: "Sat", visits: 260 },
  { day: "Sun", visits: 140 },
];

export const PEAK_HOURS = [
  { hour: "6am", visits: 120 },
  { hour: "9am", visits: 80 },
  { hour: "12pm", visits: 95 },
  { hour: "3pm", visits: 60 },
  { hour: "6pm", visits: 210 },
  { hour: "9pm", visits: 130 },
];

// Member-portal-only mock data — scoped to the demo member account
// (Aarav Mehta, MEM-1042). A real build would query these filtered by
// the signed-in member's id instead of hardcoding the name.
export const MY_VISIT_HISTORY = [
  { id: "V-01", date: "2026-08-15", check_in: "06:12", check_out: "07:40", duration: "1h 28m" },
  { id: "V-02", date: "2026-08-13", check_in: "06:05", check_out: "07:20", duration: "1h 15m" },
  { id: "V-03", date: "2026-08-11", check_in: "18:30", check_out: "19:50", duration: "1h 20m" },
  { id: "V-04", date: "2026-08-09", check_in: "06:15", check_out: "07:35", duration: "1h 20m" },
  { id: "V-05", date: "2026-08-06", check_in: "07:00", check_out: "08:10", duration: "1h 10m" },
  { id: "V-06", date: "2026-08-04", check_in: "06:10", check_out: "07:30", duration: "1h 20m" },
  { id: "V-07", date: "2026-08-01", check_in: "06:20", check_out: "07:45", duration: "1h 25m" },
];

export const MY_BOOKED_CLASS_IDS = ["CLS-01", "CLS-03"];

