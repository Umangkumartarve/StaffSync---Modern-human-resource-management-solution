import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import api, { fmtDate } from "../../api";
import { Badge, Empty, Stat } from "../ui";

const AttendanceSummary = () => {
  const [summary, setSummary] = useState([]);
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState("");

  useEffect(() => { api.get("/attendance/summary").then((r) => setSummary(r.data)); }, []);
  useEffect(() => { api.get("/attendance", { params: date ? { date } : {} }).then((r) => setRecords(r.data)); }, [date]);

  const exportCsv = () => {
    const rows = [["Name", "Email", "Department", "Present", "Late", "Total", "Today"], ...summary.map((s) => [s.name, s.email, s.department, s.present, s.late, s.total, s.today])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "attendance-report.csv"; a.click();
  };

  const presentToday = summary.filter((s) => s.today !== "Absent").length;
  return (
    <div className="stack">
      <div className="stats">
        <Stat label="Total Staff" value={summary.length} color="#3b82f6" />
        <Stat label="Present Today" value={presentToday} color="#22c55e" />
        <Stat label="Absent Today" value={summary.length - presentToday} color="#ef4444" />
      </div>
      <div className="card">
        <div className="row-between"><h3>Attendance Summary</h3>
          <button className="btn btn-ghost" onClick={exportCsv}><Download size={16} /> Export CSV</button></div>
        <table>
          <thead><tr><th>Employee</th><th>Department</th><th>Present</th><th>Late</th><th>Total Days</th><th>Today</th></tr></thead>
          <tbody>{summary.map((s) => (
            <tr key={s._id}><td><strong>{s.name}</strong><div className="muted small">{s.role}</div></td><td>{s.department}</td><td>{s.present}</td><td>{s.late}</td><td>{s.total}</td><td><Badge status={s.today} /></td></tr>
          ))}</tbody>
        </table>
      </div>
      <div className="card">
        <div className="row-between"><h3>Daily Records</h3>
          <div className="actions"><input type="date" className="select-sm" value={date} onChange={(e) => setDate(e.target.value)} />
            {date && <button className="btn btn-ghost btn-sm" onClick={() => setDate("")}>Clear</button>}</div></div>
        {records.length === 0 ? <Empty text="No records for this selection." /> : (
          <table>
            <thead><tr><th>Date</th><th>Employee</th><th>Department</th><th>Check-in</th><th>Status</th></tr></thead>
            <tbody>{records.map((r) => <tr key={r._id}><td>{fmtDate(r.date)}</td><td>{r.user?.name}</td><td>{r.user?.department}</td><td>{r.checkIn}</td><td><Badge status={r.status} /></td></tr>)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendanceSummary;
