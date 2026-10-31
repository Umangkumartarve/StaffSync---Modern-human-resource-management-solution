import React, { useEffect, useState } from "react";
import { LayoutDashboard, CalendarCheck, GraduationCap, Megaphone } from "lucide-react";
import api from "../api";
import DashboardLayout from "../components/DashboardLayout";
import { Stat } from "../components/ui";
import LeaveApplications from "../components/manager/LeaveApplications";
import TrainingManagement from "../components/manager/TrainingManagement";
import AnnouncementsManager from "../components/hr/AnnouncementsManager";

const Overview = () => {
  const [d, setD] = useState({ leaves: [], tr: [], ann: [] });
  useEffect(() => {
    Promise.all([api.get("/leaves"), api.get("/trainings"), api.get("/announcements")])
      .then(([l, t, a]) => setD({ leaves: l.data, tr: t.data, ann: a.data }));
  }, []);
  return (
    <div className="stats">
      <Stat label="Pending Leave Requests" value={d.leaves.filter((l) => l.status === "Pending").length} color="#f59e0b" />
      <Stat label="Approved Leaves" value={d.leaves.filter((l) => l.status === "Approved").length} color="#22c55e" />
      <Stat label="Training Programs" value={d.tr.length} color="#ec4899" />
      <Stat label="Announcements" value={d.ann.length} color="#3b82f6" />
    </div>
  );
};

const ManagerDashboard = () => (
  <DashboardLayout title="Manager Dashboard" tabs={[
    { key: "overview", label: "Overview", icon: LayoutDashboard, node: <Overview /> },
    { key: "leaves", label: "Leave Requests", icon: CalendarCheck, node: <LeaveApplications /> },
    { key: "training", label: "Training System", icon: GraduationCap, node: <TrainingManagement /> },
    { key: "announcements", label: "Announcements", icon: Megaphone, node: <AnnouncementsManager /> },
  ]} />
);

export default ManagerDashboard;
