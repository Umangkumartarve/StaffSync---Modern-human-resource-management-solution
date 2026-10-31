import React, { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import api, { errMsg, fmtDate } from "../../api";
import { Empty } from "../ui";

const blank = { title: "", description: "", date: "", trainer: "", assignedTo: [] };

const TrainingManagement = () => {
  const [list, setList] = useState([]);
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const load = () => api.get("/trainings").then((r) => setList(r.data));
  useEffect(() => { load(); api.get("/trainings/assignable").then((r) => setStaff(r.data)); }, []);

  const toggle = (id) => setForm({ ...form, assignedTo: form.assignedTo.includes(id) ? form.assignedTo.filter((x) => x !== id) : [...form.assignedTo, id] });

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/trainings/${editId}`, form);
      else await api.post("/trainings", form);
      setForm(blank); setEditId(null); setErr(""); load();
    } catch (er) { setErr(errMsg(er)); }
  };

  const edit = (t) => {
    setEditId(t._id);
    setForm({ title: t.title, description: t.description, date: t.date.slice(0, 10), trainer: t.trainer, assignedTo: t.assignedTo.map((u) => u._id) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const remove = async (id) => { if (window.confirm("Delete this training program?")) { await api.delete(`/trainings/${id}`); load(); } };

  return (
    <div className="stack">
      <form className="card form-grid" onSubmit={submit}>
        <h3 className="span-2">{editId ? "Edit Training Program" : "Create Training Program"}</h3>
        <div><label>Title</label><input value={form.title} onChange={set("title")} required /></div>
        <div><label>Date</label><input type="date" value={form.date} onChange={set("date")} required /></div>
        <div><label>Trainer</label><input value={form.trainer} onChange={set("trainer")} placeholder="TBD" /></div>
        <div><label>Description</label><input value={form.description} onChange={set("description")} required /></div>
        <div className="span-2"><label>Assign to employees</label>
          <div className="chips">
            {staff.map((s) => (
              <button type="button" key={s._id} className={`chip ${form.assignedTo.includes(s._id) ? "on" : ""}`} onClick={() => toggle(s._id)}>{s.name}</button>
            ))}
          </div></div>
        {err && <div className="alert alert-error span-2">{err}</div>}
        <div className="span-2 actions">
          <button className="btn btn-primary">{editId ? "Update Program" : "Create Program"}</button>
          {editId && <button type="button" className="btn btn-ghost" onClick={() => { setEditId(null); setForm(blank); }}>Cancel</button>}
        </div>
      </form>
      <div className="card">
        <h3>Training Programs</h3>
        {list.length === 0 ? <Empty text="No training programs yet." /> : (
          <table>
            <thead><tr><th>Program</th><th>Date</th><th>Trainer</th><th>Assigned To</th><th>Actions</th></tr></thead>
            <tbody>{list.map((t) => (
              <tr key={t._id}>
                <td><strong>{t.title}</strong><div className="muted small">{t.description}</div></td>
                <td>{fmtDate(t.date)}</td><td>{t.trainer}</td>
                <td>{t.assignedTo.length ? t.assignedTo.map((u) => u.name).join(", ") : <span className="muted">Nobody</span>}</td>
                <td><div className="actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => edit(t)}><Pencil size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(t._id)}><Trash2 size={14} /></button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TrainingManagement;
