import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import api, { errMsg, fmtDate } from "../../api";
import { Empty, Modal } from "../ui";

const blank = { name: "", email: "", department: "", position: "", salary: "", joinDate: "", phone: "", address: "", role: "Employee", password: "" };

const EmployeeCRUD = () => {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(null); // null = closed
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState("");

  const load = () => api.get("/employees").then((r) => setList(r.data));
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const openAdd = () => { setForm(blank); setEditId(null); setErr(""); };
  const openEdit = (e) => {
    setForm({ ...blank, ...e, role: e.user?.role || "Employee", joinDate: e.joinDate?.slice(0, 10), password: "" });
    setEditId(e._id); setErr("");
  };

  const save = async (ev) => {
    ev.preventDefault();
    try {
      if (editId) await api.put(`/employees/${editId}`, form);
      else await api.post("/employees", form);
      setForm(null); load();
    } catch (e) { setErr(errMsg(e)); }
  };

  const remove = async (e) => {
    if (!window.confirm(`Delete ${e.name}? This also removes their login, leaves and attendance.`)) return;
    try { await api.delete(`/employees/${e._id}`); load(); } catch (er) { alert(errMsg(er)); }
  };

  const shown = list.filter((e) => `${e.name} ${e.email} ${e.department} ${e.position}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="card">
      <div className="row-between">
        <h3>Employees ({list.length})</h3>
        <div className="actions">
          <div className="search"><Search size={16} /><input placeholder="Search employees" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Employee</button>
        </div>
      </div>
      {shown.length === 0 ? <Empty text="No employees found." /> : (
        <table>
          <thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Position</th><th>Salary</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>{shown.map((e) => (
            <tr key={e._id}>
              <td><strong>{e.name}</strong><div className="muted small">{e.email}</div></td>
              <td>{e.user?.role || "-"}</td><td>{e.department}</td><td>{e.position}</td>
              <td>₹{Number(e.salary).toLocaleString("en-IN")}</td><td>{fmtDate(e.joinDate)}</td>
              <td><div className="actions">
                <button className="btn btn-ghost btn-sm" title="View / Edit" onClick={() => openEdit(e)}><Pencil size={14} /></button>
                <button className="btn btn-danger btn-sm" title="Delete" onClick={() => remove(e)}><Trash2 size={14} /></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      )}

      {form && (
        <Modal title={editId ? "Edit Employee" : "Add Employee"} onClose={() => setForm(null)}>
          <form className="form-grid" onSubmit={save}>
            <div><label>Name</label><input value={form.name} onChange={set("name")} required /></div>
            <div><label>Email</label><input type="email" value={form.email} onChange={set("email")} required disabled={!!editId} /></div>
            <div><label>Department</label><input value={form.department} onChange={set("department")} required /></div>
            <div><label>Position</label><input value={form.position} onChange={set("position")} required /></div>
            <div><label>Salary (₹)</label><input type="number" min="0" value={form.salary} onChange={set("salary")} required /></div>
            <div><label>Join Date</label><input type="date" value={form.joinDate} onChange={set("joinDate")} required /></div>
            <div><label>Phone</label><input value={form.phone || ""} onChange={set("phone")} /></div>
            <div><label>Login Role</label>
              <select value={form.role} onChange={set("role")}><option>Employee</option><option>Manager</option><option>HR</option></select></div>
            <div className="span-2"><label>Address</label><input value={form.address || ""} onChange={set("address")} /></div>
            {!editId && <div className="span-2"><label>Login Password (default: password123)</label><input type="text" value={form.password} onChange={set("password")} placeholder="password123" /></div>}
            {err && <div className="alert alert-error span-2">{err}</div>}
            <div className="span-2"><button className="btn btn-primary">{editId ? "Save Changes" : "Add Employee"}</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default EmployeeCRUD;
