import React, { useState } from "react";
import PublicNavbar from "../components/public/PublicNavbar";
import HeroSection from "../components/public/HeroSection";
import AboutSection from "../components/public/AboutSection";
import MembershipSection from "../components/public/MembershipSection";
import TrainingSection from "../components/public/TrainingSection";
import ClassesSection from "../components/public/ClassesSection";
import NutritionSection from "../components/public/NutritionSection";
import WhyChooseUs from "../components/public/WhyChooseUs";
import CommunitySection from "../components/public/CommunitySection";
import BlogSection from "../components/public/BlogSection";
import LocationSection from "../components/public/LocationSection";
import ContactSection from "../components/public/ContactSection";
import PublicFooter from "../components/public/PublicFooter";
import LoginDrawer from "../components/public/LoginDrawer";

export default function Landing() {
  const [loginOpen, setLoginOpen] = useState(false);

  function openLogin() {
    setLoginOpen(true);
  }

  function scrollToMembership() {
    document.getElementById("membership")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <PublicNavbar onLoginClick={openLogin} onJoinClick={scrollToMembership} />

      <main>
        <HeroSection onJoinClick={scrollToMembership} />
        <AboutSection />
        <MembershipSection onSelectPlan={openLogin} />
        <TrainingSection />
        <ClassesSection onViewAll={openLogin} />
        <NutritionSection />
        <WhyChooseUs />
        <CommunitySection onJoinClick={scrollToMembership} />
        <BlogSection />
        <LocationSection />
        <ContactSection />
      </main>

      <PublicFooter onLoginClick={openLogin} onJoinClick={scrollToMembership} />

      <LoginDrawer isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
