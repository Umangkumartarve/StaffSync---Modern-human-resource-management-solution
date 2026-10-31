import React from "react";

export const Badge = ({ status }) => <span className={`badge badge-${(status || "").toLowerCase()}`}>{status}</span>;

export const Empty = ({ text }) => <div className="empty">{text}</div>;

export const Modal = ({ title, onClose, children }) => (
  <div className="modal-bg" onMouseDown={onClose}>
    <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
      <div className="modal-head"><h3>{title}</h3><button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button></div>
      {children}
    </div>
  </div>
);

export const Stat = ({ label, value, color }) => (
  <div className="stat" style={{ borderTopColor: color }}>
    <span className="muted small">{label}</span>
    <strong>{value}</strong>
  </div>
);
