import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { getUser } from "../api";

// Shared shell: sidebar with tabs + top bar + logout. tabs = [{ key, label, icon, node }]
const DashboardLayout = ({ title, tabs }) => {
  const user = getUser();
  const navigate = useNavigate();
  const [active, setActive] = useState(tabs[0].key);
  const current = tabs.find((t) => t.key === active);

  const logout = () => { localStorage.removeItem("user"); navigate("/login"); };

  return (
    <div className="shell">
      <aside className="sidebar">
        <h2 className="brand">HRM Portal</h2>
        <nav>
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} className={`nav-item ${active === key ? "active" : ""}`} onClick={() => setActive(key)}>
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
        <button className="nav-item logout" onClick={logout}><LogOut size={18} /> Logout</button>
      </aside>
      <section className="content">
        <div className="topbar">
          <div>
            <h1>{title}</h1>
            <p className="muted">{current.label}</p>
          </div>
          <div className="user-chip">
            <div className="avatar">{user?.name?.[0]}</div>
            <div><strong>{user?.name}</strong><span className="muted small">{user?.role}</span></div>
          </div>
        </div>
        <div key={active}>{current.node}</div>
      </section>
    </div>
  );
};

export default DashboardLayout;
