import React, { useEffect, useState } from "react";
import api from "../../api";
import LeaveApply from "./LeaveApply";
import LeaveList from "./LeaveList";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const load = () => api.get("/leaves/my").then((r) => setLeaves(r.data));
  useEffect(() => { load(); }, []);
  return <div className="stack"><LeaveApply onApplied={load} /><LeaveList leaves={leaves} /></div>;
};

export default Leaves;
