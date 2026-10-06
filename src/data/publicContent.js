// Static demo/editable content for the public marketing site. None of this
// is wired to the Supabase-shaped tables in mockData.js (except the
// membership plans, which intentionally reuse MEMBERSHIP_PLANS so pricing
// stays in sync with the real dashboard data) — swap freely without
// touching the authenticated app.

export const STATS = [
  { label: "Years Experience", value: "10+" },
  { label: "Active Members", value: "1,000+" },
  { label: "Certified Trainers", value: "12" },
  { label: "Equipment Stations", value: "60+" },
];

export const HIGHLIGHTS = [
  { title: "Expert Trainers", desc: "Certified coaches who build a plan around your goals, not a generic template." },
  { title: "Modern Equipment", desc: "Fully maintained free weights, machines and cardio, tracked and serviced regularly." },
  { title: "Personalized Training", desc: "Assessments, progress tracking and programs that adapt as you get stronger." },
  { title: "Clean & Safe Environment", desc: "Sanitized floors, well-lit spaces and a team that keeps standards high." },
];

export const TRAINING_SERVICES = [
  {
    title: "Personal Training",
    desc: "One-on-one sessions built around your goals, schedule and current fitness level.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Strength Training",
    desc: "Progressive overload programming to build raw strength safely and consistently.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Functional Training",
    desc: "Movement-based conditioning that carries over into everyday life and sport.",
    image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Cross Training",
    desc: "High-intensity, varied workouts that build stamina, power and mobility together.",
    image: "https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Weight Management",
    desc: "Structured coaching combining training and nutrition guidance for sustainable results.",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop",
  },
];

export const CLASS_SCHEDULE = [
  { name: "Strength & Conditioning", time: "Mon · Wed · Fri — 6:00 AM", level: "All levels", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop" },
  { name: "Yoga & Mobility", time: "Tue · Thu — 7:00 AM", level: "Beginner friendly", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop" },
  { name: "HIIT", time: "Mon · Wed · Fri — 6:00 PM", level: "Intermediate", image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=800&auto=format&fit=crop" },
  { name: "Functional Training", time: "Tue · Thu — 5:30 PM", level: "All levels", image: "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?q=80&w=800&auto=format&fit=crop" },
  { name: "Cardio Circuit", time: "Sat — 8:00 AM", level: "All levels", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&auto=format&fit=crop" },
  { name: "Group Fitness", time: "Sun — 9:00 AM", level: "All levels", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop" },
];

export const WHY_CHOOSE_US = [
  { title: "Certified Trainers", desc: "Every coach on the floor is certified and background-checked." },
  { title: "Modern Equipment", desc: "Regularly serviced free weights, machines and cardio stations." },
  { title: "Personalized Plans", desc: "Programs built around your assessment, not a one-size template." },
  { title: "Flexible Memberships", desc: "Month-to-month, annual and student plans — cancel or pause anytime." },
  { title: "Progress Tracking", desc: "Check-ins, attendance and milestones tracked in your member portal." },
  { title: "Supportive Community", desc: "A floor culture that pushes you without the intimidation factor." },
];

export const BLOG_POSTS = [
  {
    category: "Training",
    title: "Beginner's Guide to Strength Training",
    desc: "The core lifts, rep ranges and recovery basics every new lifter should know before adding weight to the bar.",
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop",
  },
  {
    category: "Habits",
    title: "How to Build a Consistent Workout Routine",
    desc: "Why motivation fades and structure wins — a simple framework for showing up on the days you don't feel like it.",
    image: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?q=80&w=800&auto=format&fit=crop",
  },
  {
    category: "Nutrition",
    title: "Nutrition Basics for a Healthy Lifestyle",
    desc: "Protein, portion sizes and hydration — the fundamentals that matter more than any trending diet.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
  },
];

export const NUTRITION_POINTS = [
  { title: "Nutrition Guidance", desc: "Personalized macro and meal-timing guidance from our in-house coaches." },
  { title: "Fitness Assessment", desc: "Baseline body-composition and mobility checks to set realistic targets." },
  { title: "Recovery", desc: "Mobility sessions, stretching guidance and rest-day programming." },
  { title: "Weight Management", desc: "Structured coaching that pairs training load with eating habits." },
];

export const LOCATION_INFO = {
  addressLine1: "IronGrid Fitness, Shop No. 4, Ground Floor",
  addressLine2: "Near Station Road, Kalyan, Maharashtra 421301",
  phone: "+91 98200 11234",
  email: "hello@irongrid.gym",
  hours: [
    { day: "Monday – Friday", time: "5:00 AM – 11:00 PM" },
    { day: "Saturday", time: "6:00 AM – 10:00 PM" },
    { day: "Sunday", time: "7:00 AM – 8:00 PM" },
  ],
  mapQuery: "Kalyan, Maharashtra, India",
};
