import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errMsg } from "../../api";
import { homeFor } from "../../routes/ProtectedRoute";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Employee" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/register", form);
      localStorage.setItem("user", JSON.stringify(data));
      navigate(homeFor(data.role));
    } catch (err) { setError(errMsg(err)); }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h2>HRM Portal Register</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <label>Name</label>
        <input placeholder="Enter your name" value={form.name} onChange={set("name")} required />
        <label>Email</label>
        <input type="email" placeholder="Enter your email" value={form.email} onChange={set("email")} required />
        <label>Password</label>
        <input type="password" placeholder="Enter your password" value={form.password} onChange={set("password")} required minLength={6} />
        <label>Role</label>
        <select value={form.role} onChange={set("role")}>
          <option>Employee</option><option>Manager</option><option>HR</option>
        </select>
        <button className="btn btn-primary btn-block">Register</button>
        <p className="auth-foot">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;
