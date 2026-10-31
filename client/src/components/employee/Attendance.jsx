import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import api, { errMsg, fmtDate } from "../../api";
import { Badge, Empty, Stat } from "../ui";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [msg, setMsg] = useState(null);
  const today = new Date().toISOString().slice(0, 10);

  const load = () => api.get("/attendance/my").then((r) => setRecords(r.data));
  useEffect(() => { load(); }, []);

  const mark = async () => {
    try { await api.post("/attendance/mark"); setMsg({ ok: true, text: "Attendance marked for today" }); load(); }
    catch (e) { setMsg({ ok: false, text: errMsg(e) }); }
  };

  const marked = records.some((r) => r.date === today);
  return (
    <div className="stack">
      <div className="stats">
        <Stat label="Days Present" value={records.filter((r) => r.status === "Present").length} color="#22c55e" />
        <Stat label="Days Late" value={records.filter((r) => r.status === "Late").length} color="#f59e0b" />
        <Stat label="Total Records" value={records.length} color="#3b82f6" />
      </div>
      <div className="card row-between">
        <div><h3>Today — {fmtDate(new Date())}</h3><p className="muted">{marked ? "You have already marked attendance today." : "You haven't marked attendance yet."}</p></div>
        <button className="btn btn-primary" onClick={mark} disabled={marked}><Clock size={16} /> Mark Attendance</button>
      </div>
      {msg && <div className={`alert ${msg.ok ? "alert-ok" : "alert-error"}`}>{msg.text}</div>}
      <div className="card">
        <h3>Attendance History</h3>
        {records.length === 0 ? <Empty text="No attendance records yet." /> : (
          <table><thead><tr><th>Date</th><th>Check-in</th><th>Status</th></tr></thead>
            <tbody>{records.map((r) => <tr key={r._id}><td>{fmtDate(r.date)}</td><td>{r.checkIn}</td><td><Badge status={r.status} /></td></tr>)}</tbody></table>
        )}
      </div>
    </div>
  );
};

export default Attendance;
