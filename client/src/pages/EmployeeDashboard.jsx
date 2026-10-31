import React, { useEffect, useState } from "react";
import { LayoutDashboard, CalendarDays, Clock, UserCircle, Megaphone, GraduationCap } from "lucide-react";
import api from "../api";
import DashboardLayout from "../components/DashboardLayout";
import { Stat } from "../components/ui";
import Leaves from "../components/employee/Leaves";
import Attendance from "../components/employee/Attendance";
import Profile from "../components/employee/Profile";
import Announcements from "../components/employee/Announcements";
import Trainings from "../components/employee/Trainings";

const Overview = () => {
  const [d, setD] = useState({ leaves: [], att: [], ann: [], tr: [] });
  useEffect(() => {
    Promise.all([api.get("/leaves/my"), api.get("/attendance/my"), api.get("/announcements"), api.get("/trainings")])
      .then(([l, a, n, t]) => setD({ leaves: l.data, att: a.data, ann: n.data, tr: t.data }));
  }, []);
  return (
    <div className="stack">
      <div className="stats">
        <Stat label="Pending Leaves" value={d.leaves.filter((l) => l.status === "Pending").length} color="#f59e0b" />
        <Stat label="Approved Leaves" value={d.leaves.filter((l) => l.status === "Approved").length} color="#22c55e" />
        <Stat label="Days Attended" value={d.att.length} color="#3b82f6" />
        <Stat label="Trainings" value={d.tr.length} color="#ec4899" />
      </div>
      <div className="card"><h3>Latest Announcements</h3>
        {d.ann.slice(0, 3).map((a) => <div className="mini" key={a._id}><strong>{a.title}</strong><p className="muted">{a.message}</p></div>)}
        {d.ann.length === 0 && <p className="muted">Nothing new.</p>}
      </div>
    </div>
  );
};

const EmployeeDashboard = () => (
  <DashboardLayout title="Employee Dashboard" tabs={[
    { key: "overview", label: "Overview", icon: LayoutDashboard, node: <Overview /> },
    { key: "leaves", label: "Leaves", icon: CalendarDays, node: <Leaves /> },
    { key: "attendance", label: "Attendance", icon: Clock, node: <Attendance /> },
    { key: "announcements", label: "Announcements", icon: Megaphone, node: <Announcements /> },
    { key: "training", label: "Training", icon: GraduationCap, node: <Trainings /> },
    { key: "profile", label: "Profile", icon: UserCircle, node: <Profile /> },
  ]} />
);

export default EmployeeDashboard;
