import React, { useState, useEffect } from "react";
import { UserCircle2 } from "lucide-react";
import { ChartCard } from "../../components/Cards";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import { getToken } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function TrainerDashboard() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:5000/api/trainers/me", {
          headers: {
            "Authorization": `Bearer ${getToken()}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setProfile(data.data);
        }
      } catch (err) {
        console.error("Failed to load trainer profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  function handleLogout() {
    logout();
    navigate("/logged-out", { replace: true });
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex h-screen items-center justify-center text-white">Profile not found. <Button onClick={handleLogout} className="ml-4">Log out</Button></div>;
  }

  return (
    <div className="min-h-screen w-full bg-base text-white">
      <Navbar title="Trainer Dashboard" showSearch={false} />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Welcome, {profile.name}</h1>
          <Button variant="secondary" onClick={handleLogout}>Log out</Button>
        </div>
        
        <ChartCard title="My Profile" actions={<Badge status={profile.status}>{profile.status}</Badge>}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">Trainer ID</p>
              <p className="mt-1 font-mono text-lg text-white">{profile.trainerId}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">Specialization</p>
              <p className="mt-1 text-lg text-white">{profile.specialization}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">Experience</p>
              <p className="mt-1 text-lg text-white">{profile.experience} years</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">Contact</p>
              <p className="mt-1 text-white">{profile.email}</p>
              <p className="text-white">{profile.phone}</p>
            </div>
          </div>
        </ChartCard>
      </main>
    </div>
  );
}
