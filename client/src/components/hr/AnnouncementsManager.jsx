import React, { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import api, { errMsg, fmtDate } from "../../api";
import { Empty } from "../ui";

const blank = { title: "", message: "", targetAudience: "All" };

const AnnouncementsManager = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const load = () => api.get("/announcements").then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/announcements/${editId}`, form);
      else await api.post("/announcements", form);
      setForm(blank); setEditId(null); setErr(""); load();
    } catch (er) { setErr(errMsg(er)); }
  };

  const remove = async (id) => { if (window.confirm("Delete this announcement?")) { await api.delete(`/announcements/${id}`); load(); } };

  return (
    <div className="stack">
      <form className="card form-grid" onSubmit={submit}>
        <h3 className="span-2">{editId ? "Edit Announcement" : "Post Announcement"}</h3>
        <div><label>Title</label><input value={form.title} onChange={set("title")} placeholder="Announcement title" required /></div>
        <div><label>Audience</label>
          <select value={form.targetAudience} onChange={set("targetAudience")}><option value="All">All</option><option value="Employees">Employees</option><option value="Managers">Managers</option></select></div>
        <div className="span-2"><label>Message</label><textarea rows={3} value={form.message} onChange={set("message")} placeholder="Write your message" required /></div>
        {err && <div className="alert alert-error span-2">{err}</div>}
        <div className="span-2 actions">
          <button className="btn btn-primary">{editId ? "Update" : "Post Announcement"}</button>
          {editId && <button type="button" className="btn btn-ghost" onClick={() => { setEditId(null); setForm(blank); }}>Cancel</button>}
        </div>
      </form>
      <div className="stack">
        {list.length === 0 && <Empty text="No announcements yet." />}
        {list.map((a) => (
          <div className="card row-between" key={a._id}>
            <div>
              <h3>{a.title} <span className="tag">{a.targetAudience}</span></h3>
              <p>{a.message}</p>
              <span className="muted small">By {a.createdBy?.name} on {fmtDate(a.createdAt)}</span>
            </div>
            <div className="actions">
              <button className="btn btn-ghost btn-sm" onClick={() => { setEditId(a._id); setForm({ title: a.title, message: a.message, targetAudience: a.targetAudience }); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Pencil size={14} /></button>
              <button className="btn btn-danger btn-sm" onClick={() => remove(a._id)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsManager;
