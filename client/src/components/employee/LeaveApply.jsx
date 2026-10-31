import React, { useState } from "react";
import api, { errMsg } from "../../api";

const LeaveApply = ({ onApplied }) => {
  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leaves", form);
      setMsg({ ok: true, text: "Leave request submitted" });
      setForm({ startDate: "", endDate: "", reason: "" });
      onApplied && onApplied();
    } catch (err) { setMsg({ ok: false, text: errMsg(err) }); }
  };

  return (
    <form className="card form-grid" onSubmit={submit}>
      <h3 className="span-2">Apply for Leave</h3>
      <div><label>Start Date</label><input type="date" value={form.startDate} onChange={set("startDate")} required /></div>
      <div><label>End Date</label><input type="date" value={form.endDate} min={form.startDate} onChange={set("endDate")} required /></div>
      <div className="span-2"><label>Reason</label><textarea rows={3} placeholder="Reason for leave" value={form.reason} onChange={set("reason")} required /></div>
      {msg && <div className={`alert span-2 ${msg.ok ? "alert-ok" : "alert-error"}`}>{msg.text}</div>}
      <div className="span-2"><button className="btn btn-primary">Submit Request</button></div>
    </form>
  );
};

export default LeaveApply;
