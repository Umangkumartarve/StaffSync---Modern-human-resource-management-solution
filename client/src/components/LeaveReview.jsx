import React, { useEffect, useState } from "react";
import api, { errMsg, fmtDate } from "../api";
import { Badge, Empty } from "./ui";

// Shared by HR and Manager: review leave requests.
const LeaveReview = ({ subtitle }) => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("All");
  const [err, setErr] = useState("");

  const load = () => api.get("/leaves").then((r) => setLeaves(r.data));
  useEffect(() => { load(); }, []);

  const decide = async (id, status) => {
    try { await api.put(`/leaves/${id}/status`, { status }); setErr(""); load(); }
    catch (e) { setErr(errMsg(e)); }
  };

  const shown = leaves.filter((l) => filter === "All" || l.status === filter);
  return (
    <div className="card">
      <div className="row-between">
        <div><h3>Leave Applications</h3><p className="muted small">{subtitle}</p></div>
        <select className="select-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option>
        </select>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      {shown.length === 0 ? <Empty text="No leave requests found." /> : (
        <table>
          <thead><tr><th>Employee</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{shown.map((l) => (
            <tr key={l._id}>
              <td><strong>{l.user?.name}</strong><div className="muted small">{l.user?.role} • {l.user?.department}</div></td>
              <td>{fmtDate(l.startDate)}</td><td>{fmtDate(l.endDate)}</td><td>{l.reason}</td>
              <td><Badge status={l.status} /></td>
              <td>
                {l.status === "Pending" ? (
                  <div className="actions">
                    <button className="btn btn-success btn-sm" onClick={() => decide(l._id, "Approved")}>Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={() => decide(l._id, "Rejected")}>Reject</button>
                  </div>
                ) : <span className="muted small">By {l.approverRole}</span>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveReview;
