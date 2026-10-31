import React from "react";
import { Link } from "react-router-dom";
import { Users, CalendarCheck, Briefcase, Award } from "lucide-react";

const features = [
  { icon: Users, color: "#3b82f6", title: "Employee Management", text: "Manage employee records, roles, and information efficiently." },
  { icon: CalendarCheck, color: "#22c55e", title: "Attendance & Leave", text: "Track attendance and handle leave approvals easily." },
  { icon: Briefcase, color: "#f59e0b", title: "HR & Manager Tools", text: "Handle team announcements, performance, and training modules." },
  { icon: Award, color: "#ec4899", title: "Employee Growth", text: "Monitor performance and assign development trainings." },
];

const Home = () => (
  <div className="landing">
    <header className="landing-nav">
      <h2 className="brand">HRM Portal</h2>
      <Link to="/login" className="btn btn-primary">Login / Register</Link>
    </header>
    <main className="hero">
      <h1>Empower Your Workforce with <span className="accent">HRM Portal</span></h1>
      <p>A smart Human Resource Management platform designed to simplify attendance tracking, leave management, employee records, and communication across teams.</p>
      <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
      <div className="feature-grid">
        {features.map(({ icon: Icon, color, title, text }) => (
          <div className="feature-card" key={title}>
            <Icon size={30} color={color} />
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </main>
    <footer className="landing-foot">© 2025 HRM Portal — Empowering Teams, Simplifying Workflows.</footer>
  </div>
);

export default Home;
