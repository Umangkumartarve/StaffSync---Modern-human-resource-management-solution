import React, { useEffect, useState } from "react";
import { LayoutDashboard, Users, Megaphone, Clock, CalendarCheck } from "lucide-react";
import api from "../api";
import DashboardLayout from "../components/DashboardLayout";
import { Stat } from "../components/ui";
import EmployeeCRUD from "../components/hr/EmployeeCRUD";
import AnnouncementsManager from "../components/hr/AnnouncementsManager";
import AttendanceSummary from "../components/hr/AttendanceSummary";
import LeaveApplications from "../components/hr/LeaveApplications";

const Overview = () => {
  const [d, setD] = useState({ emp: [], leaves: [], ann: [], sum: [] });
  useEffect(() => {
    Promise.all([api.get("/employees"), api.get("/leaves"), api.get("/announcements"), api.get("/attendance/summary")])
      .then(([e, l, a, s]) => setD({ emp: e.data, leaves: l.data, ann: a.data, sum: s.data }));
  }, []);
  return (
    <div className="stats">
      <Stat label="Total Employees" value={d.emp.length} color="#3b82f6" />
      <Stat label="Pending Leaves" value={d.leaves.filter((l) => l.status === "Pending").length} color="#f59e0b" />
      <Stat label="Present Today" value={d.sum.filter((s) => s.today !== "Absent").length} color="#22c55e" />
      <Stat label="Announcements" value={d.ann.length} color="#ec4899" />
    </div>
  );
};

const HrDashboard = () => (
  <DashboardLayout title="HR Dashboard" tabs={[
    { key: "overview", label: "Overview", icon: LayoutDashboard, node: <Overview /> },
    { key: "employees", label: "Employee Management", icon: Users, node: <EmployeeCRUD /> },
    { key: "leaves", label: "Leave Applications", icon: CalendarCheck, node: <LeaveApplications /> },
    { key: "announcements", label: "Announcements", icon: Megaphone, node: <AnnouncementsManager /> },
    { key: "attendance", label: "Attendance", icon: Clock, node: <AttendanceSummary /> },
  ]} />
);

export default HrDashboard;
