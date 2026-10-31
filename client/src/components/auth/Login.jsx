import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errMsg } from "../../api";
import { homeFor } from "../../routes/ProtectedRoute";

const demos = [
  { label: "HR", email: "hr@demo.com" },
  { label: "Manager", email: "manager@demo.com" },
  { label: "Employee", email: "employee@demo.com" },
];

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("user", JSON.stringify(data));
      navigate(homeFor(data.role));
    } catch (err) { setError(errMsg(err)); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h2>HRM Portal Login</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <label>Email</label>
        <input type="email" placeholder="Enter your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <label>Password</label>
        <input type="password" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="btn btn-primary btn-block" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
        <p className="auth-foot">Don't have an account? <Link to="/register">Register</Link></p>
        <div className="demo-box">
          <span>Demo accounts (password: password123)</span>
          <div className="demo-row">
            {demos.map((d) => (
              <button type="button" key={d.label} className="btn btn-ghost btn-sm" onClick={() => setForm({ email: d.email, password: "password123" })}>{d.label}</button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
