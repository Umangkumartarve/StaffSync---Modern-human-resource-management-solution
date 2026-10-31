import React, { useEffect, useState } from "react";
import api, { errMsg, fmtDate } from "../../api";

const Profile = () => {
  const [p, setP] = useState(null);
  const [msg, setMsg] = useState(null);
  useEffect(() => { api.get("/employees/me").then((r) => setP(r.data)); }, []);
  if (!p) return <p className="muted">Loading...</p>;
  const set = (k) => (e) => setP({ ...p, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.put("/employees/me", { name: p.name, phone: p.phone, address: p.address });
      const u = JSON.parse(localStorage.getItem("user")); u.name = p.name; localStorage.setItem("user", JSON.stringify(u));
      setMsg({ ok: true, text: "Profile updated" });
    } catch (err) { setMsg({ ok: false, text: errMsg(err) }); }
  };

  return (
    <form className="card form-grid" onSubmit={save}>
      <h3 className="span-2">Personal Information</h3>
      <div><label>Full Name</label><input value={p.name || ""} onChange={set("name")} required /></div>
      <div><label>Email</label><input value={p.email} disabled /></div>
      <div><label>Department</label><input value={p.department} disabled /></div>
      <div><label>Position</label><input value={p.position} disabled /></div>
      <div><label>Joined On</label><input value={fmtDate(p.joinDate)} disabled /></div>
      <div><label>Phone</label><input value={p.phone || ""} onChange={set("phone")} placeholder="Phone number" /></div>
      <div className="span-2"><label>Address</label><textarea rows={2} value={p.address || ""} onChange={set("address")} placeholder="Address" /></div>
      {msg && <div className={`alert span-2 ${msg.ok ? "alert-ok" : "alert-error"}`}>{msg.text}</div>}
      <div className="span-2"><button className="btn btn-primary">Save Changes</button></div>
    </form>
  );
};

export default Profile;
