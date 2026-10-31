import React from "react";
import { fmtDate } from "../../api";
import { Badge, Empty } from "../ui";

const LeaveList = ({ leaves }) => (
  <div className="card">
    <h3>My Leave History</h3>
    {leaves.length === 0 ? <Empty text="You haven't applied for any leave yet." /> : (
      <table>
        <thead><tr><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Reviewed By</th></tr></thead>
        <tbody>{leaves.map((l) => (
          <tr key={l._id}><td>{fmtDate(l.startDate)}</td><td>{fmtDate(l.endDate)}</td><td>{l.reason}</td><td><Badge status={l.status} /></td><td>{l.approverRole || "-"}</td></tr>
        ))}</tbody>
      </table>
    )}
  </div>
);

export default LeaveList;
